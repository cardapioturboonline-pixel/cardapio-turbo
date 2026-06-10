-- ============ EVENTOS DE ASSINATURA — rastreio de conversoes/churn ============
-- Registra cada mudanca de status de assinatura vinda do Mercado Pago,
-- alimentando o painel admin de Assinaturas com linha do tempo e churn precisos.

CREATE TABLE IF NOT EXISTS public.subscription_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  -- 'trial_started' | 'converted' | 'cancelled' | 'paused' | 'renewed' | 'reactivated'
  event_type TEXT NOT NULL,
  from_plan TEXT,          -- plano antes do evento (free/pro/business)
  to_plan TEXT,            -- plano depois do evento
  mp_subscription_id TEXT, -- id da assinatura no Mercado Pago
  mp_status TEXT,          -- status cru recebido do Mercado Pago
  city TEXT,               -- snapshot da cidade no momento do evento
  state TEXT,              -- snapshot do estado no momento do evento
  amount DECIMAL(10,2),    -- valor da assinatura, se disponivel
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sub_events_business ON public.subscription_events(business_id);
CREATE INDEX IF NOT EXISTS idx_sub_events_type ON public.subscription_events(event_type);
CREATE INDEX IF NOT EXISTS idx_sub_events_created ON public.subscription_events(created_at DESC);

ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- Leitura: apenas via service-role no painel admin (sem policy de SELECT = bloqueado).
-- Insert: o dono pode registrar eventos do proprio negocio (ex.: trial_started no cadastro).
-- O webhook do Mercado Pago grava via service-role, ignorando RLS.
DROP POLICY IF EXISTS "Owner insert own subscription events" ON public.subscription_events;
CREATE POLICY "Owner insert own subscription events" ON public.subscription_events
  FOR INSERT WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
