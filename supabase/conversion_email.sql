-- Marca quando o admin enviou o ultimo e-mail de conversao (trial -> Pro)
-- para o cliente. Usado no painel de assinaturas para evitar envio duplicado.
alter table businesses
  add column if not exists conversion_email_sent_at timestamptz;
