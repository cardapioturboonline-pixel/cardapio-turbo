-- ============ MODO PIZZARIA (Pro) ============
-- Adiciona suporte a pizza com tamanhos e meio a meio.
-- Cada produto que for um "sabor de pizza" guarda em `pizza` os tamanhos
-- com preco e o numero maximo de sabores (2 = permite meio a meio).
-- Formato do JSON:
--   { "sizes": [ { "name": "Broto", "price": 30 }, { "name": "Grande", "price": 60 } ],
--     "maxFlavors": 2 }
-- Produtos que nao sao pizza ficam com a coluna nula (comportamento atual inalterado).

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS pizza JSONB;
