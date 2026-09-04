-- ============================================================
-- RETIRADA NO LOCAL (pickup): o dono pode ligar/desligar.
-- Default true (mantém o comportamento atual).
-- ============================================================

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS pickup_enabled BOOLEAN DEFAULT true;
