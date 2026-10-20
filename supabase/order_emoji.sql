-- Emoji exibido no inicio da mensagem de novo pedido no WhatsApp.
-- Personalizavel por loja (acai usa 🥤, pizzaria 🍕, etc.). Padrao: carrinho.
alter table businesses
  add column if not exists order_emoji text default '🛒';
