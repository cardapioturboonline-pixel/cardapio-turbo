import type { Order } from '@/types'
import { formatCurrency } from '@/lib/utils/format'

// Abre uma janela com a comanda formatada (estreita, estilo cupom) e chama a
// impressão do navegador. Funciona em impressora térmica (58/80mm) ou comum.
export function printComanda(order: Order, businessName: string) {
  const esc = (s: string) => (s || '').replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string))
  const num = order.order_number ? `#${order.order_number}` : ''
  const dt = new Date(order.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  const tipo = order.order_type === 'pickup' ? 'Retirar no local' : 'Delivery'

  const itens = (order.items ?? []).map(it => `
    <div class="it">
      <div class="row"><span class="q">${it.quantity}x</span><span class="nm">${esc(it.name)}</span><span class="pr">${formatCurrency(it.price * it.quantity)}</span></div>
      ${it.observations ? `<div class="obs">${esc(it.observations)}</div>` : ''}
    </div>`).join('')

  const linhas: string[] = []
  linhas.push(`<div class="row"><span>Tipo</span><span>${tipo}</span></div>`)
  if (order.neighborhood) linhas.push(`<div class="row"><span>Bairro</span><span>${esc(order.neighborhood)}</span></div>`)
  if (order.delivery_address && order.order_type !== 'pickup') linhas.push(`<div class="obs">${esc(order.delivery_address)}</div>`)
  if (order.customer_phone) linhas.push(`<div class="row"><span>Tel</span><span>${esc(order.customer_phone)}</span></div>`)
  if (order.payment_method) linhas.push(`<div class="row"><span>Pagto</span><span>${esc(order.payment_method)}</span></div>`)
  if (order.schedule) linhas.push(`<div class="row"><span>Horário</span><span>${esc(order.schedule)}</span></div>`)

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Comanda ${num}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Courier New', monospace; width: 280px; padding: 10px 8px; color:#000; }
    .center { text-align:center; }
    .biz { font-size: 15px; font-weight: bold; }
    .num { font-size: 26px; font-weight: bold; margin: 4px 0; }
    .muted { font-size: 11px; color:#000; }
    .hr { border-top: 1px dashed #000; margin: 8px 0; }
    .row { display:flex; justify-content:space-between; font-size: 12px; gap:6px; }
    .it { margin: 4px 0; }
    .it .q { font-weight:bold; }
    .it .nm { flex:1; padding:0 4px; }
    .it .pr { white-space:nowrap; }
    .obs { font-size: 11px; font-style: italic; padding-left: 4px; }
    .tot { display:flex; justify-content:space-between; font-size: 14px; font-weight:bold; margin-top:6px; }
    @media print { body { width: auto; } }
  </style></head>
  <body onload="window.print()">
    <div class="center biz">${esc(businessName)}</div>
    <div class="center num">Pedido ${num}</div>
    <div class="center muted">${dt}${order.customer_name ? ' · ' + esc(order.customer_name) : ''}</div>
    <div class="hr"></div>
    ${itens}
    <div class="hr"></div>
    ${linhas.join('')}
    <div class="hr"></div>
    <div class="row"><span>Subtotal</span><span>${formatCurrency(order.subtotal || 0)}</span></div>
    ${order.discount ? `<div class="row"><span>Desconto</span><span>-${formatCurrency(order.discount)}</span></div>` : ''}
    ${order.delivery_fee ? `<div class="row"><span>Entrega</span><span>${formatCurrency(order.delivery_fee)}</span></div>` : ''}
    <div class="tot"><span>TOTAL</span><span>${formatCurrency(order.total || 0)}</span></div>
    ${order.observations ? `<div class="hr"></div><div class="obs">Obs: ${esc(order.observations)}</div>` : ''}
    <div class="hr"></div>
    <div class="center muted">Cardápio Turbo</div>
  </body></html>`

  const w = window.open('', '_blank', 'width=340,height=600')
  if (!w) return
  w.document.open()
  w.document.write(html)
  w.document.close()
}
