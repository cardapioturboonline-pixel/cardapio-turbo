-- ============================================================
-- ENTREGA: taxa fixa (frete único) OU taxa por bairro — o dono escolhe o modo.
-- ============================================================

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS delivery_fixed_fee DECIMAL(10,2);

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS delivery_mode TEXT; -- 'neighborhood' | 'fixed'

-- Como funciona no cardápio:
-- delivery_mode = 'fixed'        -> cobra a taxa fixa (delivery_fixed_fee) em toda entrega.
-- delivery_mode = 'neighborhood' -> usa as taxas por bairro (delivery_areas, Pro).
-- se não definido: infere pelo que estiver preenchido (bairros -> neighborhood; senão fixed).
