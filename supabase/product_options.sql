-- ============ ADICIONAIS / OPCOES DE PRODUTO ============
-- Grupos de opcoes por produto (ex.: "Ponto da carne", "Adicionais", "Acompanhamento").
-- Formato do JSON:
--   [ { "name": "Adicionais", "required": false, "max": 3,
--       "options": [ { "name": "Bacon", "price": 4 }, { "name": "Cheddar", "price": 4 } ] } ]
-- Produtos sem opcoes ficam com a coluna nula (comportamento atual inalterado).

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS option_groups JSONB;
