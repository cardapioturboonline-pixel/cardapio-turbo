-- ============================================================
-- ATENDENTE RÁPIDO / CHATBOT SIMPLES (Pro) — respostas prontas no cardápio.
-- Sem API, sem conectar o WhatsApp do dono: usa apenas link wa.me oficial.
-- ============================================================

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS chatbot_enabled  BOOLEAN DEFAULT false;

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS chatbot_greeting TEXT;

-- Lista de perguntas e respostas: [{ "q": "...", "a": "..." }, ...]
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS chatbot_faqs JSONB DEFAULT '[]'::jsonb;
