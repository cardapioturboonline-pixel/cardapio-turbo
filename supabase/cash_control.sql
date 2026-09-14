-- ============================================================
-- CONTROLE DE CAIXA (Pro) — sessões de caixa + movimentações.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.cash_sessions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id    UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  opened_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  closed_at      TIMESTAMPTZ,                 -- null enquanto o caixa está aberto
  opening_amount DECIMAL(10,2) DEFAULT 0 NOT NULL,
  closing_amount DECIMAL(10,2),               -- saldo apurado no fechamento
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cash_sessions_biz ON public.cash_sessions(business_id, closed_at);

CREATE TABLE IF NOT EXISTS public.cash_movements (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id   UUID NOT NULL REFERENCES public.cash_sessions(id) ON DELETE CASCADE,
  business_id  UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,   -- 'entrada' | 'saida' | 'sangria' | 'suprimento'
  amount       DECIMAL(10,2) NOT NULL,
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cash_moves_session ON public.cash_movements(session_id);

-- RLS: cada dono gerencia somente o próprio caixa
ALTER TABLE public.cash_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner manages own cash sessions" ON public.cash_sessions;
CREATE POLICY "Owner manages own cash sessions" ON public.cash_sessions
  FOR ALL USING (business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Owner manages own cash movements" ON public.cash_movements;
CREATE POLICY "Owner manages own cash movements" ON public.cash_movements
  FOR ALL USING (business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid()));
