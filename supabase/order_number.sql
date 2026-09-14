-- ============================================================
-- NÚMERO SEQUENCIAL DO PEDIDO (por negócio) — #1, #2, #3...
-- Usado na comanda impressa e na tela de cozinha.
-- ============================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_number INTEGER;

-- Define o próximo número por negócio. SECURITY DEFINER para enxergar todos os
-- pedidos do negócio (o cardápio público insere como anon, sem ver as linhas via RLS).
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    SELECT COALESCE(MAX(order_number), 0) + 1
      INTO NEW.order_number
      FROM public.orders
     WHERE business_id = NEW.business_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_order_number ON public.orders;
CREATE TRIGGER trg_set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_order_number();

-- Numera os pedidos que já existem (por negócio, na ordem de criação).
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY business_id ORDER BY created_at) AS n
  FROM public.orders
)
UPDATE public.orders o
SET order_number = numbered.n
FROM numbered
WHERE o.id = numbered.id AND o.order_number IS NULL;
