-- ============ PROGRAMA DE FIDELIDADE ============

-- Configuração de fidelidade no negócio
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS loyalty_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS loyalty_goal    INTEGER DEFAULT 10;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS loyalty_reward  TEXT;

-- Função segura: retorna apenas a contagem de pedidos concluídos de um cliente
-- (o cliente público pode chamar via RPC, mas NÃO consegue ler os pedidos dos outros)
CREATE OR REPLACE FUNCTION get_customer_order_count(p_business_id UUID, p_phone TEXT)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.orders
  WHERE business_id = p_business_id
    AND regexp_replace(customer_phone, '\D', '', 'g') = regexp_replace(p_phone, '\D', '', 'g')
    AND status = 'delivered';
$$ LANGUAGE sql SECURITY DEFINER;
