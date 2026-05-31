import type { Product, InsightRecommendation } from '@/types'

export function generateInsights(products: Product[]): InsightRecommendation[] {
  const insights: InsightRecommendation[] = []

  const productsWithoutPhoto = products.filter(p => !p.image_url && p.is_available)
  if (productsWithoutPhoto.length > 0) {
    insights.push({
      type: 'no_photo',
      title: `${productsWithoutPhoto.length} produto(s) sem foto`,
      description: 'Produtos com foto vendem até 3x mais. Adicione imagens para aumentar conversões.',
      action: 'Adicionar fotos',
      product_id: productsWithoutPhoto[0].id,
    })
  }

  const prices = products.filter(p => p.price > 0).map(p => p.price)
  if (prices.length > 0) {
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
    const lowPriceProducts = products.filter(p => p.price < avgPrice * 0.5 && p.price > 0)
    if (lowPriceProducts.length > 0) {
      insights.push({
        type: 'low_price',
        title: 'Produtos com preço abaixo da média',
        description: `Preço médio do seu cardápio é R$ ${avgPrice.toFixed(2)}. Considere revisar preços.`,
        action: 'Revisar preços',
        product_id: lowPriceProducts[0].id,
      })
    }
  }

  const lowViewProducts = products.filter(p => p.views < 10 && p.is_available && p.is_featured === false)
  if (lowViewProducts.length > 0) {
    insights.push({
      type: 'low_views',
      title: `${lowViewProducts.length} produto(s) com poucas visualizações`,
      description: 'Marque produtos como destaque para aumentar a visibilidade.',
      action: 'Destacar produtos',
      product_id: lowViewProducts[0].id,
    })
  }

  if (products.length >= 3 && !products.some(p => p.is_combo)) {
    insights.push({
      type: 'combo_suggestion',
      title: 'Crie combos para aumentar o ticket médio',
      description: 'Combos aumentam o valor médio dos pedidos em até 40%. Experimente criar um!',
      action: 'Criar combo',
    })
  }

  if (products.filter(p => p.orders > 5).length >= 2) {
    insights.push({
      type: 'promotion',
      title: 'Oportunidade de promoção detectada',
      description: 'Seus produtos mais pedidos podem virar promoções relâmpago para atrair mais clientes.',
      action: 'Criar promoção',
    })
  }

  return insights
}
