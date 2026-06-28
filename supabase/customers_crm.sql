-- ============================================================
-- CRM — BASE DE CLIENTES (Pilar 1: "Seja dono do seu cliente")
-- Cria uma base de clientes por negocio que se preenche sozinha
-- a cada novo pedido. Identidade = (business_id, telefone normalizado).
-- ============================================================

-- 1) Tabela de clientes (1 linha por cliente, por negocio)
CREATE TABLE IF NOT EXISTS public.customers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id     UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name            TEXT,
  phone           TEXT NOT NULL,                 -- somente digitos
  birthday        DATE,
  first_order_at  TIMESTAMPTZ DEFAULT NOW(),
  last_order_at   TIMESTAMPTZ DEFAULT NOW(),
  orders_count    INTEGER DEFAULT 0,
  total_spent     DECIMAL(10,2) DEFAULT 0,
  tags            TEXT[] DEFAULT '{}',
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (business_id, phone)
);

CREATE INDEX IF NOT EXISTS idx_customers_business   ON public.customers(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_last_order ON public.customers(business_id, last_order_at);

-- 2) Vincula o pedido ao cliente (opcional, util para historico)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);

-- 3) Funcao: ao inserir pedido, cria/atualiza o cliente e agrega metricas
CREATE OR REPLACE FUNCTION public.upsert_customer_on_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_phone TEXT;
  v_cid   UUID;
BEGIN
  -- normaliza o telefone (so digitos); sem telefone, nao cria cliente
  v_phone := regexp_replace(COALESCE(NEW.customer_phone, ''), '\D', '', 'g');
  IF v_phone = '' THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.customers AS c
    (business_id, name, phone, first_order_at, last_order_at, orders_count, total_spent)
  VALUES
    (NEW.business_id, NEW.customer_name, v_phone, NEW.created_at, NEW.created_at, 1, COALESCE(NEW.total, 0))
  ON CONFLICT (business_id, phone) DO UPDATE SET
    name          = COALESCE(EXCLUDED.name, c.name),
    last_order_at = GREATEST(c.last_order_at, EXCLUDED.last_order_at),
    orders_count  = c.orders_count + 1,
    total_spent   = c.total_spent + COALESCE(NEW.total, 0)
  RETURNING c.id INTO v_cid;

  UPDATE public.orders SET customer_id = v_cid WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_upsert_customer ON public.orders;
CREATE TRIGGER trg_upsert_customer
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.upsert_customer_on_order();

-- 4) Backfill: popula a base com os pedidos que JA existem
INSERT INTO public.customers
  (business_id, name, phone, first_order_at, last_order_at, orders_count, total_spent)
SELECT
  o.business_id,
  (array_agg(o.customer_name ORDER BY o.created_at DESC))[1],
  regexp_replace(o.customer_phone, '\D', '', 'g') AS phone,
  MIN(o.created_at),
  MAX(o.created_at),
  COUNT(*),
  COALESCE(SUM(o.total), 0)
FROM public.orders o
WHERE COALESCE(o.customer_phone, '') <> ''
GROUP BY o.business_id, regexp_replace(o.customer_phone, '\D', '', 'g')
ON CONFLICT (business_id, phone) DO NOTHING;

-- 5) RLS: cada dono ve/gerencia somente os proprios clientes
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner manages own customers" ON public.customers;
CREATE POLICY "Owner manages own customers" ON public.customers
  FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid())
  );

-- ============================================================
-- TAGS automaticas (novo / recorrente / sumido / VIP) sao calculadas
-- na aplicacao a partir de last_order_at, orders_count e total_spent
-- para nao precisar de cron. Ver Pilar 1.3.
-- ============================================================
