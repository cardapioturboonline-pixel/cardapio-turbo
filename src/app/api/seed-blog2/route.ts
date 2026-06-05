import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SEED_SECRET = 'turbo-seed-2026'

const posts = [
  {
    title: 'Como precificar os produtos da sua lanchonete e ter mais lucro',
    slug: 'como-precificar-produtos-lanchonete',
    author: 'Equipe Cardápio Turbo',
    excerpt: 'Aprenda a calcular o preço certo dos seus lanches, definir a margem de lucro ideal e parar de perder dinheiro por chutar os valores do cardápio.',
    category: 'Gestão',
    read_minutes: 7,
    cover_emoji: '💰',
    seo_title: 'Como Precificar Produtos da Lanchonete (Fórmula 2026)',
    seo_description: 'Aprenda a precificar os lanches da sua lanchonete com a fórmula certa. Calcule custo, margem de lucro e markup para vender mais e lucrar de verdade.',
    keywords: 'precificação lanchonete, como precificar lanche, margem de lucro lanchonete, markup, formar preço de venda',
    content: '<p>Definir o preço dos produtos é uma das decisões mais importantes — e mais negligenciadas — de quem tem uma lanchonete. Cobrar de menos quebra o caixa; cobrar de mais afasta o cliente. Veja como acertar.</p><h2>Por que precificar corretamente é tão importante?</h2><p>Muitos donos de lanchonete definem o preço "no olho", copiando o concorrente ou chutando. O problema é que cada negócio tem custos diferentes. Sem uma conta clara, você pode estar vendendo bastante e <strong>mesmo assim no prejuízo</strong>.</p><h2>Passo 1: calcule o custo de cada produto (CMV)</h2><p>O CMV (Custo da Mercadoria Vendida) é quanto você gasta com os ingredientes de cada item. Some tudo o que vai em um X-Burguer, por exemplo:</p><ul><li>Pão</li><li>Carne</li><li>Queijo, bacon e molhos</li><li>Embalagem</li></ul><p>Se o total der R$ 8,00, esse é o seu custo direto.</p><h2>Passo 2: considere os custos fixos</h2><p>Além dos ingredientes, você tem aluguel, luz, gás, água, salários e taxas de entrega. Esses custos precisam estar embutidos no preço. Uma forma simples é estimar quanto representam por produto vendido.</p><h2>Passo 3: aplique o markup</h2><p>O <strong>markup</strong> é o multiplicador que você aplica sobre o custo para chegar ao preço de venda. Para lanchonetes, é comum usar entre 2,5x e 4x o CMV. No exemplo do X-Burguer com custo de R$ 8,00:</p><ul><li>Markup 3x = R$ 24,00 de preço de venda</li><li>Markup 3,5x = R$ 28,00</li></ul><p>Quanto maior o markup, maior a margem — mas atenção ao que o cliente está disposto a pagar na sua região.</p><h2>Passo 4: revise periodicamente</h2><p>Os preços dos ingredientes mudam o tempo todo. Reveja sua precificação pelo menos a cada 2 ou 3 meses. Com um <strong>cardápio digital</strong>, você atualiza os preços em segundos, sem reimprimir nada.</p><h2>Conclusão</h2><p>Precificar bem é o que separa a lanchonete que cresce da que vive no sufoco. Calcule seu custo, aplique um markup saudável e mantenha tudo atualizado. <a href="/register">Crie seu cardápio digital grátis</a> e tenha controle total dos seus preços e produtos.</p>',
  },
  {
    title: '15 ideias de promoção para lanchonete que realmente funcionam',
    slug: 'ideias-de-promocao-para-lanchonete',
    author: 'Equipe Cardápio Turbo',
    excerpt: 'Promoções bem feitas atraem clientes, aumentam o ticket médio e movimentam os dias parados. Veja 15 ideias práticas para aplicar na sua lanchonete hoje.',
    category: 'Marketing',
    read_minutes: 8,
    cover_emoji: '🔥',
    seo_title: '15 Ideias de Promoção para Lanchonete que Funcionam (2026)',
    seo_description: 'Confira 15 ideias de promoção para lanchonete que atraem clientes e aumentam as vendas. Combos, cupons, dias temáticos e muito mais para lucrar mais.',
    keywords: 'promoção para lanchonete, ideias de promoção, promoção hamburgueria, combo promocional, marketing lanchonete',
    content: '<p>Uma boa promoção faz o cliente sair de casa e ainda gastar mais. Mas promoção mal calculada vira prejuízo. Separamos 15 ideias testadas que funcionam de verdade para lanchonetes.</p><h2>Promoções para aumentar o movimento</h2><ul><li><strong>Combo do dia:</strong> lanche + batata + refri com preço especial.</li><li><strong>Dois por um:</strong> compre um lanche e leve outro na compra acima de X reais.</li><li><strong>Terça do hambúrguer:</strong> escolha um dia parado e crie uma oferta fixa.</li><li><strong>Happy hour:</strong> desconto em horários de menor movimento.</li><li><strong>Frete grátis acima de X:</strong> incentiva o cliente a pedir mais.</li></ul><h2>Promoções para aumentar o ticket médio</h2><ul><li><strong>Suba de tamanho por R$ 3:</strong> batata P para G por uma diferença pequena.</li><li><strong>Adicione bacon por R$ 4:</strong> upsell simples e lucrativo.</li><li><strong>Sobremesa com 50% off na compra do combo.</strong></li><li><strong>Kit família:</strong> 4 lanches + acompanhamentos com desconto.</li></ul><h2>Promoções para fidelizar</h2><ul><li><strong>Cartão fidelidade:</strong> a cada 10 lanches, 1 grátis.</li><li><strong>Cupom de retorno:</strong> dê um cupom para a próxima compra.</li><li><strong>Aniversariante ganha sobremesa.</strong></li><li><strong>Indique um amigo e ganhe desconto.</strong></li></ul><h2>Promoções sazonais</h2><ul><li><strong>Datas comemorativas:</strong> Dia dos Namorados, Copa, festas juninas.</li><li><strong>Combo de fim de semana exclusivo.</strong></li></ul><h2>Dica de ouro: use cupons digitais</h2><p>Em vez de promoções genéricas, crie <strong>cupons de desconto</strong> com código. Assim você controla quantas vezes foram usados e mede o resultado. No Cardápio Turbo (plano Pro) você cria cupons em segundos e acompanha o uso.</p><h2>Conclusão</h2><p>Promoção boa é a que traz cliente sem destruir sua margem. Teste algumas dessas ideias e veja o que funciona melhor no seu público. <a href="/register">Monte seu cardápio digital grátis</a> e comece a criar promoções que vendem.</p>',
  },
  {
    title: 'Como divulgar sua lanchonete no Instagram e atrair clientes',
    slug: 'como-divulgar-lanchonete-instagram',
    author: 'Equipe Cardápio Turbo',
    excerpt: 'O Instagram é uma das ferramentas mais poderosas e gratuitas para atrair clientes. Veja o passo a passo para divulgar sua lanchonete e lotar o movimento.',
    category: 'Marketing',
    read_minutes: 7,
    cover_emoji: '📸',
    seo_title: 'Como Divulgar Lanchonete no Instagram e Atrair Clientes (2026)',
    seo_description: 'Aprenda a divulgar sua lanchonete no Instagram com dicas práticas de posts, stories, reels e bio. Atraia mais clientes e venda mais pelo WhatsApp.',
    keywords: 'como divulgar lanchonete, marketing lanchonete instagram, divulgar hamburgueria, instagram para lanchonete, atrair clientes',
    content: '<p>O Instagram é a vitrine digital da sua lanchonete. Bem usado, ele atrai clientes novos todos os dias — de graça. Veja como fazer do jeito certo.</p><h2>1. Capriche no perfil</h2><p>Sua bio deve dizer em segundos o que você vende, onde fica e como pedir. Inclua o <strong>link do seu cardápio digital</strong> na bio para o cliente pedir direto. Use uma foto de perfil com sua logo.</p><h2>2. Poste fotos que dão água na boca</h2><p>Comida vende pelos olhos. Invista em boas fotos dos seus lanches — boa luz, fundo limpo e o produto em destaque. Pratos com foto vendem até 3x mais.</p><h2>3. Use os Stories todos os dias</h2><p>Os Stories mantêm sua lanchonete na cabeça do cliente. Mostre os bastidores, o preparo, promoções do dia e depoimentos. Use enquetes e caixinhas de pergunta para engajar.</p><h2>4. Aposte nos Reels</h2><p>Vídeos curtos de preparo (o famoso "montando o hambúrguer") têm grande alcance e podem viralizar. É a forma mais rápida de alcançar gente nova na sua cidade.</p><h2>5. Use hashtags locais</h2><p>Inclua hashtags da sua cidade, como #hamburguerianacidade ou #lanchesnomeuca. Assim quem busca comida na região te encontra.</p><h2>6. Facilite o pedido</h2><p>De nada adianta atrair se for difícil pedir. Tenha um <strong>cardápio digital com link e QR Code</strong> que leva o cliente direto ao pedido no WhatsApp. Coloque o link nos Stories e na bio.</p><h2>7. Poste com constância</h2><p>Não precisa postar 5 vezes por dia, mas mantenha uma frequência (3 a 5 posts por semana + Stories diários). Constância é o que constrói audiência.</p><h2>Conclusão</h2><p>O Instagram atrai o cliente, mas é o cardápio digital que fecha a venda. Junte os dois e veja seu movimento crescer. <a href="/register">Crie seu cardápio digital grátis</a> e coloque o link na sua bio hoje mesmo.</p>',
  },
  {
    title: 'Como montar combos que aumentam o ticket médio da lanchonete',
    slug: 'como-montar-combos-lanchonete',
    author: 'Equipe Cardápio Turbo',
    excerpt: 'Combos bem montados fazem o cliente gastar mais sem perceber e aumentam seu faturamento. Aprenda a criar combos irresistíveis e lucrativos.',
    category: 'Gestão',
    read_minutes: 6,
    cover_emoji: '🍟',
    seo_title: 'Como Montar Combos para Lanchonete e Vender Mais (2026)',
    seo_description: 'Aprenda a montar combos irresistíveis na sua lanchonete para aumentar o ticket médio. Dicas de precificação, combinações e como destacar no cardápio.',
    keywords: 'combo lanchonete, como montar combo, ticket médio lanchonete, combo hambúrguer, aumentar faturamento',
    content: '<p>Combo é a forma mais inteligente de vender mais para o mesmo cliente. Em vez de um lanche de R$ 25, ele leva um combo de R$ 38 — e sai feliz. Veja como montar combos que funcionam.</p><h2>Por que combos aumentam o faturamento?</h2><p>O combo aumenta o <strong>ticket médio</strong>, ou seja, o valor que cada cliente gasta. Um combo bem montado pode elevar seu faturamento em até 40% sem precisar de mais clientes.</p><h2>1. Combine itens que fazem sentido</h2><p>O combo clássico funciona: lanche + acompanhamento + bebida. O cliente já ia querer batata e refri mesmo, então facilite a decisão dele juntando tudo.</p><h2>2. Crie a sensação de vantagem</h2><p>O combo precisa parecer mais vantajoso do que comprar separado. Se o lanche é R$ 25, a batata R$ 12 e o refri R$ 8 (total R$ 45), ofereça o combo por R$ 38. O cliente sente que economizou e você vendeu mais.</p><h2>3. Ofereça combos para diferentes públicos</h2><ul><li><strong>Combo individual:</strong> para quem come sozinho.</li><li><strong>Combo casal:</strong> 2 lanches + acompanhamento para dividir.</li><li><strong>Combo família:</strong> 4 lanches + porções grandes.</li></ul><h2>4. Destaque os combos no cardápio</h2><p>Coloque os combos em posição de destaque, com foto caprichada. No <strong>cardápio digital</strong>, marque-os como destaque para aparecerem primeiro.</p><h2>5. Use o combo para girar produtos parados</h2><p>Tem um produto que vende pouco? Inclua em um combo para dar saída e reduzir desperdício.</p><h2>Conclusão</h2><p>Combos são uma máquina silenciosa de aumentar vendas. Monte combinações inteligentes, precifique com vantagem e destaque no cardápio. <a href="/register">Crie seu cardápio digital grátis</a> e comece a montar combos que vendem sozinhos.</p>',
  },
  {
    title: 'Nomes criativos para lanchonete e hamburgueria (com dicas)',
    slug: 'nomes-criativos-para-lanchonete',
    author: 'Equipe Cardápio Turbo',
    excerpt: 'Escolher um bom nome é o primeiro passo para uma marca forte. Veja dezenas de ideias de nomes criativos para lanchonete e hamburgueria e como escolher o seu.',
    category: 'Marketing',
    read_minutes: 6,
    cover_emoji: '💡',
    seo_title: 'Nomes Criativos para Lanchonete e Hamburgueria (+ Dicas 2026)',
    seo_description: 'Veja dezenas de ideias de nomes criativos para lanchonete e hamburgueria. Dicas práticas para escolher um nome forte, fácil de lembrar e que vende.',
    keywords: 'nomes para lanchonete, nome para hamburgueria, nomes criativos lanchonete, como escolher nome lanchonete, nome de lanche',
    content: '<p>O nome da sua lanchonete é a primeira coisa que o cliente vê — e o que ele vai lembrar (ou esquecer). Um bom nome ajuda a marca a pegar. Veja ideias e dicas para escolher o seu.</p><h2>O que faz um bom nome de lanchonete?</h2><ul><li><strong>Fácil de falar e lembrar.</strong></li><li><strong>Curto e marcante.</strong></li><li><strong>Que combine com seu estilo</strong> (artesanal, divertido, retrô…).</li><li><strong>Disponível</strong> como perfil no Instagram e domínio na internet.</li></ul><h2>Ideias de nomes para hamburgueria</h2><ul><li>Brasa Burger</li><li>Smash House</li><li>Rei do Hambúrguer</li><li>Burger da Esquina</li><li>Chama Burger</li><li>Ponto do Lanche</li><li>Burger Bros</li><li>Estação Burger</li></ul><h2>Ideias de nomes para lanchonete</h2><ul><li>Cantinho do Lanche</li><li>Sabor Express</li><li>Lanche & Cia</li><li>Point do Sabor</li><li>Fome Zero Lanches</li><li>Recanto do Lanche</li><li>Top Lanches</li><li>Esquina Gourmet</li></ul><h2>Dicas para escolher o nome certo</h2><p>Depois de listar suas ideias, faça o teste: fale em voz alta, peça opinião de amigos e veja se o nome é fácil de escrever. Verifique se o <strong>perfil no Instagram</strong> e o domínio estão disponíveis antes de decidir.</p><h2>Não esqueça da presença digital</h2><p>Escolhido o nome, garanta sua presença online: perfil no Instagram, Google Meu Negócio e um <strong>cardápio digital com link próprio</strong>. Assim o cliente acha você e pede em segundos.</p><h2>Conclusão</h2><p>Um bom nome abre portas, mas é a experiência que fideliza. Escolha um nome forte e dê a ele uma vitrine digital profissional. <a href="/register">Crie o cardápio digital da sua lanchonete grátis</a> e comece a construir sua marca.</p>',
  },
  {
    title: 'Delivery próprio: como organizar o cardápio e vender mais',
    slug: 'delivery-proprio-organizar-cardapio',
    author: 'Equipe Cardápio Turbo',
    excerpt: 'Montar um delivery próprio economiza nas taxas dos aplicativos e aproxima você do cliente. Veja como organizar o cardápio e operar um delivery de sucesso.',
    category: 'Guias',
    read_minutes: 7,
    cover_emoji: '🛵',
    seo_title: 'Delivery Próprio: Como Organizar o Cardápio e Vender Mais (2026)',
    seo_description: 'Aprenda a montar um delivery próprio para sua lanchonete, fugir das taxas dos apps e organizar o cardápio para vender mais pelo WhatsApp.',
    keywords: 'delivery próprio, delivery lanchonete, cardápio delivery, como montar delivery, vender no whatsapp, fugir das taxas ifood',
    content: '<p>Os aplicativos de delivery cobram taxas que comem boa parte do seu lucro. Ter um <strong>delivery próprio</strong> coloca esse dinheiro de volta no seu bolso e te dá controle sobre o cliente. Veja como fazer.</p><h2>Por que ter delivery próprio?</h2><ul><li><strong>Menos taxas:</strong> você não paga 20% a 30% por pedido.</li><li><strong>Cliente é seu:</strong> você tem o contato e pode fidelizar.</li><li><strong>Mais controle:</strong> você define preços, promoções e regras.</li></ul><h2>1. Organize seu cardápio por categorias</h2><p>Um cardápio bagunçado afasta o cliente. Separe por categorias claras: Lanches, Combos, Porções, Bebidas e Sobremesas. Facilite a navegação.</p><h2>2. Capriche nas fotos e descrições</h2><p>No delivery, o cliente não vê o produto pessoalmente. Boas fotos e descrições que dão água na boca fazem toda a diferença na decisão de compra.</p><h2>3. Use um cardápio digital com pedido no WhatsApp</h2><p>Em vez de anotar pedido por telefone (lento e sujeito a erro), use um <strong>cardápio digital</strong> em que o cliente monta o pedido sozinho e envia formatado para o seu WhatsApp — com itens, endereço e forma de pagamento.</p><h2>4. Defina área de entrega e taxa</h2><p>Estabeleça até onde você entrega e qual a taxa por região. Deixe isso claro no cardápio para evitar confusão.</p><h2>5. Tenha formas de pagamento variadas</h2><p>Aceite Pix, dinheiro e cartão na entrega. O Pix é especialmente útil: o cliente paga na hora e você recebe na hora.</p><h2>6. Divulgue seu link</h2><p>Coloque o link do seu cardápio na bio do Instagram, no status do WhatsApp e no Google Meu Negócio. Gere também um <strong>QR Code</strong> para colocar nas embalagens.</p><h2>Conclusão</h2><p>Delivery próprio é mais lucro e mais controle. Com um cardápio digital organizado e pedidos no WhatsApp, você opera de forma profissional sem pagar taxas absurdas. <a href="/register">Crie seu cardápio digital grátis</a> e monte seu delivery próprio hoje.</p>',
  },
]

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('secret') !== SEED_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ error: 'env missing' }, { status: 500 })

  const supabase = createClient(url, key)
  const slugs = posts.map(p => p.slug)
  await supabase.from('blog_posts').delete().in('slug', slugs)
  const { error } = await supabase.from('blog_posts').insert(posts)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, inserted: posts.length })
}
