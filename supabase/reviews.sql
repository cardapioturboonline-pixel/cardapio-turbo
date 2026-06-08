-- ============ AVALIAÇÕES DOS CLIENTES ============

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_name TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_business ON public.reviews(business_id);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved reviews" ON public.reviews;
CREATE POLICY "Public read approved reviews" ON public.reviews
  FOR SELECT USING (approved = true);

DROP POLICY IF EXISTS "Anyone can insert review" ON public.reviews;
CREATE POLICY "Anyone can insert review" ON public.reviews
  FOR INSERT WITH CHECK (true);

-- Dono pode gerenciar (moderar/excluir) as próprias avaliações
DROP POLICY IF EXISTS "Owner manage reviews" ON public.reviews;
CREATE POLICY "Owner manage reviews" ON public.reviews
  FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
