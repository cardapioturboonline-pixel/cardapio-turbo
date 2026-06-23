-- ============ CONTROLE DE E-MAIL DE REATIVACAO (winback) ============
-- Guarda quando o ultimo e-mail de reativacao foi enviado para cada negocio,
-- para evitar reenvios seguidos. O painel admin usa um cooldown (ex.: 7 dias).

ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS winback_sent_at TIMESTAMPTZ;
