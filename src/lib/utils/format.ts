export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatWhatsApp(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function buildWhatsAppMessage(
  businessName: string,
  items: Array<{ name: string; quantity: number; price: number; additionals?: string[] }>,
  subtotal: number,
  discount: number,
  total: number,
  deliveryAddress?: string,
  paymentMethod?: string,
  observations?: string,
  couponCode?: string
): string {
  let message = `🍔 *Pedido - ${businessName}*\n\n`
  message += `*Itens do Pedido:*\n`

  items.forEach((item) => {
    message += `▪ ${item.quantity}x ${item.name} — ${formatCurrency(item.price * item.quantity)}\n`
    if (item.additionals?.length) {
      message += `  _Adicionais: ${item.additionals.join(', ')}_\n`
    }
  })

  message += `\n`
  message += `*Subtotal:* ${formatCurrency(subtotal)}\n`

  if (discount > 0 && couponCode) {
    message += `*Cupom (${couponCode}):* -${formatCurrency(discount)}\n`
  }

  message += `*Total:* ${formatCurrency(total)}\n\n`

  if (deliveryAddress) {
    message += `📍 *Endereço:* ${deliveryAddress}\n`
  }

  if (paymentMethod) {
    message += `💳 *Pagamento:* ${paymentMethod}\n`
  }

  if (observations) {
    message += `📝 *Obs:* ${observations}\n`
  }

  return encodeURIComponent(message)
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function isOpenNow(openingHours?: Record<string, { open: string; close: string; closed: boolean }>): boolean {
  if (!openingHours) return true

  const now = new Date()
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const today = days[now.getDay()]
  const dayHours = openingHours[today]

  if (!dayHours || dayHours.closed) return false

  const [openH, openM] = dayHours.open.split(':').map(Number)
  const [closeH, closeM] = dayHours.close.split(':').map(Number)
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
}
