-- ============================================================
-- TAXA FIXA DE ENTREGA (frete único, sem depender de bairro)
-- Disponível para todos os planos (Free e Pro).
-- ============================================================

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS delivery_fixed_fee DECIMAL(10,2);

-- Como funciona no cardápio:
-- 1) Se houver bairros cadastrados (Pro) -> usa a taxa por bairro.
-- 2) Senão, se delivery_fixed_fee estiver definida -> cobra essa taxa fixa em toda entrega.
-- 3) Senão -> sem taxa automática (combina com o cliente).
