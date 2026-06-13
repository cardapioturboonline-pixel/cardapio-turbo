// FAQ por artigo do blog. A MESMA fonte alimenta o bloco visível na página
// e o schema FAQPage (JSON-LD), garantindo que batem — exigência do Google.

export interface FaqItem { q: string; a: string }

export const FAQ_BY_SLUG: Record<string, FaqItem[]> = {
  'pizza-meio-a-meio-preco-cardapio-digital': [
    {
      q: 'Como é calculado o preço da pizza meio a meio?',
      a: 'No método proporcional, soma-se metade do preço de cada sabor escolhido, ou seja, a média dos dois. Exemplo: Calabresa (R$ 60) e Quatro Queijos (R$ 80) resultam em (60 + 80) / 2 = R$ 70. O Cardápio Turbo faz esse cálculo automaticamente.',
    },
    {
      q: 'Cobrar a média ou o sabor mais caro?',
      a: 'Existem os dois métodos no mercado. O Cardápio Turbo usa a média dos dois sabores, que costuma ser o mais justo para o cliente. Cobrar o sabor mais caro também é comum, mas pode passar a impressão de preço alto.',
    },
    {
      q: 'Como ativar o modo pizzaria no Cardápio Turbo?',
      a: 'Crie uma categoria de Pizzas, cadastre cada sabor ativando o Modo pizza com os tamanhos e preços, e escolha permitir meio a meio (2 sabores). O recurso está disponível no plano Pro.',
    },
    {
      q: 'O cliente consegue montar a pizza sozinho?',
      a: 'Sim. No cardápio, o cliente escolhe o tamanho, seleciona inteira ou meio a meio e, no meio a meio, escolhe o segundo sabor. O preço aparece na hora e o pedido chega no seu WhatsApp com o valor correto.',
    },
  ],
  'festa-junina-cardapio-digital-arraia': [
    {
      q: 'Como vender comidas típicas de festa junina no cardápio digital?',
      a: 'Crie uma categoria especial de festa junina no Cardápio Turbo com os itens da data (quentão, canjica, pamonha, milho, espetinho, cachorro-quente e doces), com foto e preço. O cliente escolhe e o pedido chega no seu WhatsApp.',
    },
    {
      q: 'Vale a pena montar combos para a festa junina?',
      a: 'Sim. Combos como kit festa junina para 4 pessoas elevam o ticket médio e facilitam a vida de quem vai receber gente em casa. Deixe os combos em destaque no cardápio.',
    },
    {
      q: 'Que cupom usar na temporada junina?',
      a: 'Cupons temáticos como ARRAIA10 atraem pedidos. Defina um pedido mínimo para proteger a margem e uma data limite para criar senso de urgência.',
    },
  ],
  'ferias-julho-cardapio-digital-pedidos': [
    {
      q: 'Por que os pedidos aumentam nas férias de julho?',
      a: 'Com as crianças em casa e mais tempo livre, cresce a procura por comida pronta, delivery e programas em família. Os picos costumam acontecer à noite e nos fins de semana.',
    },
    {
      q: 'Como dar conta do aumento de pedidos sem perder venda?',
      a: 'Deixe combos para família em destaque, use o painel de pedidos ao vivo para acompanhar tudo em tempo real e ative o frete automático por bairro para agilizar o atendimento nos horários de pico.',
    },
    {
      q: 'Como aproveitar as férias para fidelizar clientes?',
      a: 'Quem pede pelo seu cardápio digital entra no seu canal. Use o programa de fidelidade e um cupom de férias (como FERIAS10) para transformar o cliente do período em cliente o ano todo.',
    },
  ],
  'dia-dos-pais-combos-cardapio-digital': [
    {
      q: 'Como montar um combo para o Dia dos Pais?',
      a: 'Crie um combo especial no Cardápio Turbo, por exemplo um prato principal generoso com acompanhamento e bebida, e deixe ele em destaque. Para famílias, ofereça também combos para 4 ou 6 pessoas.',
    },
    {
      q: 'Que cupom usar no Dia dos Pais?',
      a: 'Cupons como PAIS10 incentivam o pedido. Combine com um pedido mínimo para aumentar o ticket médio e divulgue com alguns dias de antecedência.',
    },
    {
      q: 'Quando começar a divulgar a promoção de Dia dos Pais?',
      a: 'Comece alguns dias antes, nos stories, no feed e no status do WhatsApp. Quem se planeja recebe encomendas com folga e evita o sufoco de última hora.',
    },
  ],
  'como-montar-cupons-cardapio-digital-dia-dos-namorados': [
    {
      q: 'Como criar um cupom de desconto para o Dia dos Namorados?',
      a: 'No painel do Cardápio Turbo, em Promoções, clique em criar cupom, escolha um código com a cara da data (como AMOR10), defina o tipo de desconto (percentual ou valor fixo) e um pedido mínimo. Ao ativar, o cupom já passa a valer no cardápio e o cliente aplica o código ao fechar o pedido.',
    },
    {
      q: 'Percentual ou valor fixo: qual desconto usar?',
      a: 'O desconto percentual (ex.: 10 por cento) funciona melhor em pedidos maiores. O valor fixo (ex.: 10 reais) passa uma sensação clara de economia em pedidos menores. Para o Dia dos Namorados, combine com um pedido mínimo para proteger a margem.',
    },
    {
      q: 'Quais ideias de cupom vendem mais no Dia dos Namorados?',
      a: 'Combo do casal com cupom exclusivo, frete grátis acima de um valor, vantagem na sobremesa e cupom de retorno para a próxima compra. Defina sempre uma data limite para criar senso de urgência.',
    },
    {
      q: 'Onde divulgar o cupom para ele funcionar?',
      a: 'Coloque o código na bio do Instagram, no status do WhatsApp e nos stories, e faça um post mostrando o desconto e o prazo. Quanto mais gente souber do cupom, mais pedidos ele gera.',
    },
  ],
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
