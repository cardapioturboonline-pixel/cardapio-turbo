-- ============ PAINEL DE PEDIDOS — migração ============

-- Colunas extras para o painel de pedidos em tempo real
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_type   TEXT DEFAULT 'delivery';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS neighborhood TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items        JSONB DEFAULT '[]';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS schedule     TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_code  TEXT;

-- Permitir que o dono atualize o status dos próprios pedidos
DROP POLICY IF EXISTS "Owner can update own orders" ON public.orders;
CREATE POLICY "Owner can update own orders" ON public.orders
  FOR UPDATE USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- Habilitar realtime na tabela de pedidos (atualização ao vivo no painel)
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
