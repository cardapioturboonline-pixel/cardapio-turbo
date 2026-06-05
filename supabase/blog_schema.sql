-- ============ BLOG / CONTEÚDO SEO ============

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,                 -- HTML do artigo
  cover_emoji TEXT DEFAULT '📝',
  cover_image TEXT,                      -- URL opcional da imagem de capa
  category TEXT DEFAULT 'Dicas',
  author TEXT DEFAULT 'Equipe Cardápio Turbo',
  seo_title TEXT,                        -- title da aba/SERP (fallback: title)
  seo_description TEXT,                  -- meta description
  keywords TEXT,                         -- palavras-chave separadas por vírgula
  read_minutes INTEGER DEFAULT 5,
  published BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

-- RLS: qualquer um lê posts publicados; apenas service role escreve
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published posts" ON public.blog_posts;
CREATE POLICY "Public can read published posts" ON public.blog_posts
  FOR SELECT USING (published = true);

-- ============ ARTIGOS INICIAIS (SEED) ============

INSERT INTO public.blog_posts (title, slug, excerpt, category, read_minutes, seo_title, seo_description, keywords, cover_emoji, content) VALUES
(
  'Como criar um cardápio digital para sua lanchonete em 2026',
  'como-criar-cardapio-digital-lanchonete',
  'Aprenda o passo a passo completo para digitalizar o cardápio da sua lanchonete, aumentar pedidos pelo WhatsApp e profissionalizar seu negócio sem gastar nada para começar.',
  'Guias',
  7,
  'Como Criar um Cardápio Digital para Lanchonete (Passo a Passo 2026)',
  'Guia completo para criar um cardápio digital grátis para sua lanchonete. Aprenda a usar QR Code, receber pedidos no WhatsApp e vender mais em 2026.',
  'cardápio digital, cardápio online, lanchonete, qr code, pedido whatsapp, cardápio digital grátis',
  '📱',
  '<p>Se você tem uma lanchonete, hamburgueria ou qualquer negócio de alimentação, já deve ter percebido que o cardápio de papel ficou no passado. Em 2026, ter um <strong>cardápio digital</strong> deixou de ser um luxo e passou a ser essencial para quem quer vender mais e profissionalizar o atendimento.</p><h2>Por que ter um cardápio digital?</h2><p>O cardápio digital traz vantagens que o papel nunca conseguiu oferecer:</p><ul><li><strong>Atualização instantânea:</strong> mudou um preço? Atualize em segundos, sem reimprimir nada.</li><li><strong>Fotos dos produtos:</strong> pratos com foto vendem até 3x mais.</li><li><strong>Pedidos pelo WhatsApp:</strong> o cliente monta o pedido e envia direto para você.</li><li><strong>QR Code nas mesas:</strong> o cliente escaneia e acessa o cardápio na hora.</li></ul><h2>Passo a passo para criar o seu</h2><h3>1. Escolha uma plataforma</h3><p>Existem várias opções no mercado, mas o ideal é escolher uma ferramenta simples, que funcione no celular e que ofereça integração com WhatsApp. O <strong>Cardápio Turbo</strong>, por exemplo, permite criar tudo em menos de 5 minutos e começar grátis.</p><h3>2. Cadastre seus produtos</h3><p>Adicione nome, descrição, preço e foto de cada item. Organize tudo em categorias (lanches, bebidas, sobremesas) para facilitar a navegação do cliente.</p><h3>3. Gere seu QR Code</h3><p>Com o cardápio pronto, gere um QR Code personalizado. Imprima e cole nas mesas, no balcão e na vitrine. Você também pode compartilhar o link nas redes sociais.</p><h3>4. Receba pedidos no WhatsApp</h3><p>Quando o cliente finaliza o pedido, ele chega formatado direto no seu WhatsApp, com itens, endereço e forma de pagamento. Sem ligação, sem erro de anotação.</p><h2>Quanto custa ter um cardápio digital?</h2><p>A boa notícia é que dá para começar de graça. Plataformas como o Cardápio Turbo oferecem um plano gratuito com tudo que você precisa para começar a vender, e planos pagos a partir de R$ 29,90/mês para quem quer recursos avançados como cupons de desconto e relatórios.</p><h2>Conclusão</h2><p>Criar um cardápio digital nunca foi tão fácil. Em poucos minutos você sai do papel e passa a oferecer uma experiência moderna, que aumenta seus pedidos e fortalece a imagem do seu negócio. <a href="/register">Crie o seu cardápio digital grátis agora</a> e comece a vender mais hoje mesmo.</p>'
),
(
  '5 receitas de hambúrguer artesanal para vender mais na sua lanchonete',
  'receitas-hamburguer-artesanal-vender-mais',
  'Descubra 5 receitas de hambúrguer artesanal que conquistam clientes e aumentam o ticket médio da sua lanchonete. Ingredientes, montagem e dicas de precificação.',
  'Receitas',
  8,
  '5 Receitas de Hambúrguer Artesanal para Vender Mais (2026)',
  'Aprenda 5 receitas de hambúrguer artesanal irresistíveis para sua lanchonete. Dicas de ingredientes, montagem e como precificar para lucrar mais.',
  'hambúrguer artesanal, receita hambúrguer, lanchonete, hamburgueria, receita lanche, vender hambúrguer',
  '🍔',
  '<p>O hambúrguer artesanal é um dos campeões de venda em qualquer lanchonete. Mas para se destacar da concorrência, você precisa de receitas que surpreendam o cliente. Separamos 5 receitas testadas e aprovadas que vão fazer sucesso no seu <strong>cardápio digital</strong>.</p><h2>1. Clássico Cheddar Bacon</h2><p>O queridinho do público. Pão brioche, hambúrguer de 150g, cheddar cremoso, bacon crocante e maionese da casa. Simples, mas certeiro. <strong>Dica de preço:</strong> R$ 24,90 a R$ 29,90.</p><h2>2. Smash Burger Duplo</h2><p>A tendência que veio para ficar. Dois discos finos de carne prensados na chapa, queijo derretido e cebola caramelizada. O segredo está na crosta dourada da carne. <strong>Ticket médio:</strong> R$ 27,90.</p><h2>3. Burger Gourmet com Geleia de Pimenta</h2><p>Para o público que busca algo diferente: hambúrguer de 180g, queijo brie, rúcula e geleia de pimenta. Um equilíbrio perfeito entre doce e picante. <strong>Preço sugerido:</strong> R$ 34,90.</p><h2>4. Veggie Burger</h2><p>Não deixe o público vegetariano de fora. Hambúrguer de grão-de-bico ou de feijão preto, com queijo vegano e molho especial. Cada vez mais procurado. <strong>Preço:</strong> R$ 26,90.</p><h2>5. Bacon Lovers</h2><p>Para os fãs de bacon: hambúrguer, cheddar, muito bacon e cebola crispy. Indulgente e irresistível. <strong>Ticket:</strong> R$ 31,90.</p><h2>Como aumentar o ticket médio com combos</h2><p>Ofereça combos com batata frita e refrigerante. Um combo bem montado pode aumentar seu faturamento em até 40%. No seu cardápio digital, destaque os combos com fotos atrativas.</p><h2>Conclusão</h2><p>Receitas boas atraem clientes, mas um cardápio digital profissional faz eles voltarem. <a href="/register">Monte seu cardápio digital grátis</a> e coloque essas receitas para vender no automático, com pedidos direto no seu WhatsApp.</p>'
),
(
  'QR Code no restaurante: como usar para aumentar suas vendas',
  'qr-code-restaurante-aumentar-vendas',
  'Entenda como o QR Code revolucionou o atendimento em restaurantes e lanchonetes. Veja onde colocar, como gerar e as melhores práticas para vender mais.',
  'Dicas',
  6,
  'QR Code no Restaurante: Guia Completo para Vender Mais (2026)',
  'Saiba como usar QR Code no seu restaurante ou lanchonete para agilizar pedidos, reduzir custos e aumentar vendas. Guia prático e atualizado para 2026.',
  'qr code restaurante, qr code cardápio, cardápio qr code, menu digital, atendimento restaurante',
  '📲',
  '<p>O <strong>QR Code</strong> deixou de ser novidade e virou padrão em restaurantes, bares e lanchonetes do Brasil inteiro. Se o seu negócio ainda não usa, você está perdendo vendas e deixando o atendimento mais lento. Veja como aproveitar essa ferramenta poderosa.</p><h2>O que é o QR Code de cardápio?</h2><p>É um código que, ao ser escaneado pela câmera do celular, leva o cliente direto ao seu cardápio digital. Sem precisar baixar aplicativo, sem cadastro, sem complicação. Em segundos o cliente já está vendo seus produtos com foto e preço.</p><h2>Vantagens do QR Code no restaurante</h2><ul><li><strong>Agilidade:</strong> o cliente faz o pedido sozinho, reduzindo filas e esperas.</li><li><strong>Economia:</strong> chega de gastar com impressão de cardápios.</li><li><strong>Higiene:</strong> sem cardápios físicos passando de mão em mão.</li><li><strong>Atualização fácil:</strong> mudou o preço ou esgotou um item? Atualize na hora.</li></ul><h2>Onde colocar o QR Code</h2><p>Para aproveitar ao máximo, coloque seu QR Code em pontos estratégicos:</p><ul><li>Nas mesas (adesivos ou displays de acrílico)</li><li>No balcão e no caixa</li><li>Na vitrine e na porta de entrada</li><li>Nas embalagens de delivery</li><li>Nas redes sociais e no Google Meu Negócio</li></ul><h2>Como gerar um QR Code para seu cardápio</h2><p>Com o Cardápio Turbo é simples: você cria seu cardápio digital e a plataforma gera automaticamente um QR Code personalizado com a sua marca. Basta baixar em PNG ou PDF e imprimir.</p><h2>Boas práticas</h2><p>Sempre teste seu QR Code antes de imprimir. Garanta que o cardápio carregue rápido e funcione bem no celular. E não esqueça de incluir uma chamada clara, como "Aponte a câmera e faça seu pedido".</p><h2>Conclusão</h2><p>O QR Code é simples, barato e extremamente eficaz para modernizar seu atendimento e vender mais. <a href="/register">Crie seu cardápio digital com QR Code grátis</a> e comece a colher os resultados hoje mesmo.</p>'
)
ON CONFLICT (slug) DO NOTHING;

-- Função para incrementar views de um post
CREATE OR REPLACE FUNCTION increment_post_views(p_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.blog_posts SET views = views + 1 WHERE slug = p_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
