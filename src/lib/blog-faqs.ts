// FAQ por artigo do blog. A MESMA fonte alimenta o bloco visível na página
// e o schema FAQPage (JSON-LD), garantindo que batem — exigência do Google.

export interface FaqItem { q: string; a: string }

export const FAQ_BY_SLUG: Record<string, FaqItem[]> = {
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
