// Sugestões de cardápio por nicho, usadas para guiar o cliente no onboarding.
// A chave corresponde ao tipo de negócio escolhido (BUSINESS_TYPES).
// Preços são apenas sugestões de ponto de partida; o dono ajusta depois.

export interface NicheProduct { name: string; price: string; category: string }
export interface NicheSuggestion {
  categories: string[]
  products: NicheProduct[]
  tip: string
}

const GENERIC: NicheSuggestion = {
  categories: ['Destaques', 'Mais pedidos', 'Bebidas', 'Sobremesas'],
  products: [
    { name: 'Item mais pedido', price: '', category: 'Mais pedidos' },
    { name: 'Refrigerante lata', price: '6.00', category: 'Bebidas' },
    { name: 'Água mineral', price: '4.00', category: 'Bebidas' },
  ],
  tip: 'Comece pelos seus itens mais vendidos. Capriche no nome e na foto depois no painel.',
}

export const NICHE_SUGGESTIONS: Record<string, NicheSuggestion> = {
  'Pizzaria': {
    categories: ['Pizzas Salgadas', 'Pizzas Doces', 'Bordas', 'Bebidas'],
    products: [
      { name: 'Pizza Calabresa', price: '45.00', category: 'Pizzas Salgadas' },
      { name: 'Pizza Mussarela', price: '42.00', category: 'Pizzas Salgadas' },
      { name: 'Pizza Portuguesa', price: '48.00', category: 'Pizzas Salgadas' },
      { name: 'Pizza Frango com Catupiry', price: '49.00', category: 'Pizzas Salgadas' },
      { name: 'Pizza Chocolate', price: '42.00', category: 'Pizzas Doces' },
      { name: 'Borda Catupiry', price: '8.00', category: 'Bordas' },
      { name: 'Refrigerante 2L', price: '12.00', category: 'Bebidas' },
    ],
    tip: 'Dica: ative o modo pizzaria (meio a meio) no painel para o cliente montar sabores. Ofereça bordas recheadas para aumentar o ticket.',
  },
  'Açaí / Sorveteria': {
    categories: ['Açaí', 'Complementos', 'Sorvetes', 'Bebidas'],
    products: [
      { name: 'Açaí 300ml', price: '12.00', category: 'Açaí' },
      { name: 'Açaí 500ml', price: '18.00', category: 'Açaí' },
      { name: 'Açaí 700ml', price: '24.00', category: 'Açaí' },
      { name: 'Açaí na garrafa 500ml', price: '20.00', category: 'Açaí' },
      { name: 'Adicional Leite em pó', price: '3.00', category: 'Complementos' },
      { name: 'Adicional Morango', price: '4.00', category: 'Complementos' },
      { name: 'Refrigerante lata', price: '6.00', category: 'Bebidas' },
    ],
    tip: 'Dica: cadastre o açaí como item montável (Tamanho + Complementos) para o cliente escolher o que vai por cima.',
  },
  'Hamburgueria': {
    categories: ['Hambúrgueres', 'Combos', 'Acompanhamentos', 'Bebidas'],
    products: [
      { name: 'X-Salada', price: '22.00', category: 'Hambúrgueres' },
      { name: 'X-Bacon', price: '26.00', category: 'Hambúrgueres' },
      { name: 'X-Tudo', price: '30.00', category: 'Hambúrgueres' },
      { name: 'Combo Burger + Batata + Refri', price: '36.00', category: 'Combos' },
      { name: 'Batata Frita', price: '14.00', category: 'Acompanhamentos' },
      { name: 'Refrigerante lata', price: '6.00', category: 'Bebidas' },
    ],
    tip: 'Dica: crie combos (lanche + batata + bebida) para aumentar o ticket médio sem o cliente sentir que gastou mais.',
  },
  'Lanchonete': {
    categories: ['Lanches', 'Salgados', 'Porções', 'Bebidas'],
    products: [
      { name: 'Misto Quente', price: '10.00', category: 'Lanches' },
      { name: 'X-Burguer', price: '18.00', category: 'Lanches' },
      { name: 'Coxinha', price: '7.00', category: 'Salgados' },
      { name: 'Porção de Batata', price: '16.00', category: 'Porções' },
      { name: 'Refrigerante lata', price: '6.00', category: 'Bebidas' },
      { name: 'Suco natural', price: '8.00', category: 'Bebidas' },
    ],
    tip: 'Dica: destaque os lanches mais vendidos na categoria de topo para vender mais rápido.',
  },
  'Restaurante': {
    categories: ['Pratos', 'Marmitas', 'Porções', 'Bebidas'],
    products: [
      { name: 'Prato Feito (PF)', price: '20.00', category: 'Pratos' },
      { name: 'Prato Executivo', price: '28.00', category: 'Pratos' },
      { name: 'Marmita Pequena', price: '16.00', category: 'Marmitas' },
      { name: 'Marmita Grande', price: '22.00', category: 'Marmitas' },
      { name: 'Refrigerante lata', price: '6.00', category: 'Bebidas' },
    ],
    tip: 'Dica: ofereça tamanhos de marmita (P, M, G) como item montável para facilitar a escolha.',
  },
  'Marmitaria': {
    categories: ['Marmitas', 'Pratos do dia', 'Adicionais', 'Bebidas'],
    products: [
      { name: 'Marmita Pequena', price: '15.00', category: 'Marmitas' },
      { name: 'Marmita Média', price: '18.00', category: 'Marmitas' },
      { name: 'Marmita Grande', price: '22.00', category: 'Marmitas' },
      { name: 'Prato do dia', price: '20.00', category: 'Pratos do dia' },
      { name: 'Adicional de carne', price: '6.00', category: 'Adicionais' },
      { name: 'Refrigerante lata', price: '6.00', category: 'Bebidas' },
    ],
    tip: 'Dica: cadastre a marmita com tamanhos (P, M, G) e deixe os adicionais como complementos.',
  },
  'Padaria': {
    categories: ['Pães', 'Salgados', 'Doces', 'Bebidas'],
    products: [
      { name: 'Pão Francês (kg)', price: '16.00', category: 'Pães' },
      { name: 'Pão de Queijo', price: '4.00', category: 'Salgados' },
      { name: 'Sonho', price: '6.00', category: 'Doces' },
      { name: 'Bolo fatia', price: '8.00', category: 'Doces' },
      { name: 'Café', price: '5.00', category: 'Bebidas' },
      { name: 'Suco natural', price: '8.00', category: 'Bebidas' },
    ],
    tip: 'Dica: destaque os itens do café da manhã e combos (pão + café) para o início do dia.',
  },
  'Doceria / Confeitaria': {
    categories: ['Doces', 'Bolos', 'Tortas', 'Bebidas'],
    products: [
      { name: 'Brigadeiro', price: '3.50', category: 'Doces' },
      { name: 'Brownie', price: '9.00', category: 'Doces' },
      { name: 'Fatia de Bolo', price: '10.00', category: 'Bolos' },
      { name: 'Torta de Limão (fatia)', price: '12.00', category: 'Tortas' },
      { name: 'Café', price: '5.00', category: 'Bebidas' },
    ],
    tip: 'Dica: ofereça caixas/kits (6, 12 unidades) para vender em quantidade.',
  },
  'Cafeteria': {
    categories: ['Cafés', 'Lanches', 'Doces', 'Bebidas Geladas'],
    products: [
      { name: 'Espresso', price: '6.00', category: 'Cafés' },
      { name: 'Cappuccino', price: '10.00', category: 'Cafés' },
      { name: 'Pão de Queijo', price: '5.00', category: 'Lanches' },
      { name: 'Bolo fatia', price: '9.00', category: 'Doces' },
      { name: 'Cappuccino Gelado', price: '12.00', category: 'Bebidas Geladas' },
    ],
    tip: 'Dica: monte combos de café + salgado para o lanche da manhã e da tarde.',
  },
  'Pastelaria': {
    categories: ['Pastéis', 'Caldo de Cana', 'Porções', 'Bebidas'],
    products: [
      { name: 'Pastel de Carne', price: '9.00', category: 'Pastéis' },
      { name: 'Pastel de Queijo', price: '9.00', category: 'Pastéis' },
      { name: 'Pastel de Frango c/ Catupiry', price: '11.00', category: 'Pastéis' },
      { name: 'Caldo de Cana 500ml', price: '8.00', category: 'Caldo de Cana' },
      { name: 'Refrigerante lata', price: '6.00', category: 'Bebidas' },
    ],
    tip: 'Dica: o combo pastel + caldo de cana é clássico e vende muito. Crie como combo.',
  },
  'Bar': {
    categories: ['Porções', 'Petiscos', 'Cervejas', 'Drinks'],
    products: [
      { name: 'Porção de Batata', price: '25.00', category: 'Porções' },
      { name: 'Porção de Frango a Passarinho', price: '35.00', category: 'Porções' },
      { name: 'Isca de Peixe', price: '38.00', category: 'Petiscos' },
      { name: 'Cerveja Long Neck', price: '10.00', category: 'Cervejas' },
      { name: 'Caipirinha', price: '15.00', category: 'Drinks' },
    ],
    tip: 'Dica: porções para compartilhar aumentam o ticket. Destaque as mais pedidas.',
  },
  'Food truck': {
    categories: ['Lanches', 'Combos', 'Acompanhamentos', 'Bebidas'],
    products: [
      { name: 'Hambúrguer Artesanal', price: '24.00', category: 'Lanches' },
      { name: 'Hot Dog Completo', price: '18.00', category: 'Lanches' },
      { name: 'Combo Lanche + Batata + Refri', price: '34.00', category: 'Combos' },
      { name: 'Batata Frita', price: '14.00', category: 'Acompanhamentos' },
      { name: 'Refrigerante lata', price: '6.00', category: 'Bebidas' },
    ],
    tip: 'Dica: um cardápio enxuto e combos bem montados agilizam o atendimento na rua.',
  },
  'Cesta de Café da Manhã / Presentes': {
    categories: ['Cestas', 'Cestas Luxo', 'Adicionais', 'Datas Especiais'],
    products: [
      { name: 'Cesta Café da Manhã Simples', price: '80.00', category: 'Cestas' },
      { name: 'Cesta Café da Manhã Completa', price: '120.00', category: 'Cestas' },
      { name: 'Cesta Café da Manhã Luxo', price: '180.00', category: 'Cestas Luxo' },
      { name: 'Cesta Romântica (casal)', price: '160.00', category: 'Cestas Luxo' },
      { name: 'Adicional Balão metalizado', price: '20.00', category: 'Adicionais' },
      { name: 'Adicional Vinho / Espumante', price: '45.00', category: 'Adicionais' },
      { name: 'Adicional Cartão personalizado', price: '10.00', category: 'Adicionais' },
      { name: 'Cesta Dia das Mães', price: '150.00', category: 'Datas Especiais' },
    ],
    tip: 'Dica: descreva bem o que vem em cada cesta e use fotos reais. Cadastre balão, vinho e cartão como adicionais (item montável) e combine a data de entrega com o cliente.',
  },
  'Mercadinho / Conveniência': {
    categories: ['Bebidas', 'Mercearia', 'Gelados', 'Limpeza'],
    products: [
      { name: 'Refrigerante 2L', price: '10.00', category: 'Bebidas' },
      { name: 'Cerveja lata', price: '5.00', category: 'Bebidas' },
      { name: 'Pão de forma', price: '9.00', category: 'Mercearia' },
      { name: 'Sorvete pote', price: '18.00', category: 'Gelados' },
      { name: 'Gelo 5kg', price: '12.00', category: 'Gelados' },
    ],
    tip: 'Dica: organize por corredores (bebidas, mercearia, limpeza) para o cliente achar rápido.',
  },
}

// Retorna a sugestão do nicho (ou uma genérica quando o tipo não tem mapa).
export function getNicheSuggestion(type?: string | null): NicheSuggestion {
  if (!type) return GENERIC
  return NICHE_SUGGESTIONS[type] ?? GENERIC
}
