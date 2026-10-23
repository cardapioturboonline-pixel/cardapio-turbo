-- Modo catálogo/presente (cestas de café da manhã, presentes).
-- Quando ligado, o checkout coleta dados de presente (entrega agendada,
-- quem recebe, mensagem do cartão, surpresa) e a página vira "Catálogo".
alter table businesses
  add column if not exists catalog_mode boolean default false;

-- Dados de presente do pedido (estruturado). Opcional.
alter table orders
  add column if not exists gift_info jsonb;
