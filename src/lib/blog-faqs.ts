// FAQ por artigo do blog. A MESMA fonte alimenta o bloco visível na página
// e o schema FAQPage (JSON-LD), garantindo que batem — exigência do Google.

export interface FaqItem { q: string; a: string }

export const FAQ_BY_SLUG: Record<string, FaqItem[]> = {
  'bares-restaurantes-faturamento-copa-do-mundo': [
    {
      q: 'Bares e restaurantes faturam mais durante a Copa do Mundo?',
      a: 'Sim. A Copa reúne grupos de pessoas assistindo ao mesmo evento ao mesmo tempo, o que aumenta o número de clientes por mesa, o tempo de permanência e o consumo de bebidas e porções. Os picos são previsíveis, pois você sabe a data e o horário dos jogos.',
    },
    {
      q: 'Quais negócios mais se beneficiam da Copa?',
      a: 'Bares e pubs com TV, hamburguerias e petiscarias, pizzarias e delivery, além de açaís, sorveterias e docerias que entram como sobremesa do grupo e em pedidos para assistir em casa.',
    },
    {
      q: 'Como lucrar de verdade e não só encher a casa na Copa?',
      a: 'Encher a casa é a parte fácil. Para lucrar, organize os pedidos para não perder venda, crie combos e cupons pensados para o dia de jogo e capture o cliente em um canal próprio para vender novamente depois. Um cardápio digital com painel de pedidos ao vivo ajuda em todas essas frentes.',
    },
    {
      q: 'Como me preparar para a Copa do Mundo no meu estabelecimento?',
      a: 'Defina o cardápio do jogo, monte combos, crie cupons de desconto, organize a equipe e deixe o cardápio digital pronto para receber os pedidos pelo WhatsApp antes da primeira partida.',
    },
  ],
  'cardapio-digital-vs-ifood': [
    {
      q: 'Cardápio digital é melhor que o iFood?',
      a: 'Depende do objetivo. O iFood ajuda a ser descoberto por novos clientes, mas cobra comissão por pedido. O cardápio digital próprio recebe o pedido direto no WhatsApp, sem comissão, e mantém o cliente como seu. A estratégia ideal é usar os dois: o marketplace para aquisição e o canal próprio para reter e fidelizar.',
    },
    {
      q: 'Quanto de comissão o iFood cobra por pedido?',
      a: 'As taxas variam conforme o plano e o modelo de entrega, podendo chegar a cerca de 30% do valor do pedido somando comissão e taxas. No cardápio digital próprio, a venda é 100% sua, sem comissão por pedido.',
    },
    {
      q: 'Posso usar o cardápio digital e o iFood ao mesmo tempo?',
      a: 'Sim. O recomendado é usar o iFood para alcançar novos clientes e o cardápio digital para fidelizar quem já te conhece. O convite para pedir direto deve acontecer fora da plataforma de delivery, como na loja física, na embalagem de pedidos próprios e nas redes sociais.',
    },
    {
      q: 'Como faço o cliente migrar do iFood para o meu WhatsApp?',
      a: 'Incentive o pedido direto fora do aplicativo: QR Code na mesa e no balcão, adesivo na embalagem dos pedidos próprios, link na bio do Instagram e no status do WhatsApp, e um cupom exclusivo para quem pede pelo seu cardápio digital.',
    },
  ],
  'como-montar-cardapio-digital': [
    {
      q: 'Quanto custa para montar um cardápio digital?',
      a: 'No Cardápio Turbo você monta e testa gratuitamente por 7 dias, sem cartão de crédito. Depois do período de teste, há um plano Pro mensal com todos os recursos liberados.',
    },
    {
      q: 'Preciso saber programar ou contratar um designer?',
      a: 'Não. O cardápio é montado em poucos minutos direto pelo celular ou computador: você cadastra os produtos com foto e preço, escolhe as cores e pronto — sem código e sem designer.',
    },
    {
      q: 'Como o cliente faz o pedido pelo cardápio digital?',
      a: 'O cliente acessa seu link ou QR Code, escolhe os itens e finaliza. O pedido chega no seu WhatsApp já formatado, com os itens, observações, endereço e valor total.',
    },
    {
      q: 'Quanto tempo leva para colocar o cardápio no ar?',
      a: 'Cerca de 10 minutos. Você cria a conta, cadastra categorias e produtos, personaliza com a sua marca e já gera o link e o QR Code para divulgar.',
    },
  ],
  'promocoes-cupons-copa-do-mundo': [
    {
      q: 'Como criar um cupom de desconto para a Copa do Mundo?',
      a: 'No painel do Cardápio Turbo, em Promoções, você cria um cupom (ex.: COPA10), define o tipo de desconto (percentual ou valor fixo) e um pedido mínimo. O cliente aplica o cupom na hora de fechar o pedido.',
    },
    {
      q: 'Quais promoções funcionam melhor em dias de jogo?',
      a: 'Combos para assistir ao jogo, cupom de desconto progressivo, promoção a cada gol da seleção, frete grátis acima de um valor e kits para assistir em casa costumam aumentar bastante o ticket médio nos dias de partida.',
    },
    {
      q: 'Vale a pena dar frete grátis durante a Copa?',
      a: 'Sim, desde que com um valor mínimo de pedido que cubra o custo. O frete grátis a partir de um valor incentiva o cliente a comprar mais para atingir o limite, aumentando o pedido médio.',
    },
  ],
  'catalogo-cestas-dia-dos-namorados': [
    {
      q: 'Dá para vender cestas de presente pelo Cardápio Turbo?',
      a: 'Sim. Você cria categorias por tipo de cesta (românticas, café da manhã, kits vinho) e cadastra cada cesta como um produto com foto, descrição dos itens e preço. O pedido chega pronto no seu WhatsApp.',
    },
    {
      q: 'Como controlar o estoque das cestas disponíveis?',
      a: 'Quando uma cesta esgota ou você atinge o limite de produção do dia, basta desativar o produto no painel — ele some do catálogo na hora. Ao repor, você reativa em um clique.',
    },
    {
      q: 'Quando devo montar o catálogo para o Dia dos Namorados?',
      a: 'O quanto antes. Montar o catálogo leva poucos minutos e, divulgando com antecedência, você recebe encomendas com folga para produzir e evita o sufoco de última hora.',
    },
  ],
}
