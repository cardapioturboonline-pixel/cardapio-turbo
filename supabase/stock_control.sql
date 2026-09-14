-- ============================================================
-- CONTROLE DE ESTOQUE por produto.
-- stock = NULL  -> sem controle (ilimitado, comportamento atual)
-- stock = número -> controla; ao zerar, o item é desativado no cardápio.
-- ============================================================

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS stock INTEGER;

-- Baixa o estoque dos itens de um pedido e desativa o que zerar.
-- SECURITY DEFINER: roda como dono da tabela, então funciona mesmo quando
-- chamada pelo cardápio público (cliente anônimo), respeitando o negócio do produto.
CREATE OR REPLACE FUNCTION public.decrement_stock(p_items JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE it JSONB;
BEGIN
  FOR it IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    UPDATE public.products
      SET stock = GREATEST(0, stock - GREATEST(1, (it->>'quantity')::int)),
          is_available = CASE
            WHEN stock - GREATEST(1, (it->>'quantity')::int) > 0 THEN is_available
            ELSE false
          END
      WHERE id = (it->>'product_id')::uuid
        AND stock IS NOT NULL;
  END LOOP;
END;
$$;

-- Permite que o cardápio público (anon) e o dono (authenticated) chamem a função.
GRANT EXECUTE ON FUNCTION public.decrement_stock(JSONB) TO anon, authenticated;
