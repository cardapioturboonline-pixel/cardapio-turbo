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
  <body>
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

  // Impressão via iframe invisível (funciona no celular — sem pop-up bloqueado).
  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc) { document.body.removeChild(iframe); return }
  doc.open(); doc.write(html); doc.close()

  const cleanup = () => { try { document.body.removeChild(iframe) } catch { /* ignore */ } }
  const run = () => {
    try {
      const win = iframe.contentWindow
      if (!win) { cleanup(); return }
      win.focus()
      win.onafterprint = cleanup
      win.print()
      // fallback de limpeza (alguns navegadores não disparam onafterprint)
      setTimeout(cleanup, 60000)
    } catch { cleanup() }
  }
  // dá um tempinho para renderizar o conteúdo antes de imprimir
  setTimeout(run, 250)
}

// Baixa a comanda como PDF (formato 80mm, estilo cupom). Útil no celular
// sem impressora — o dono guarda/reimprime ou compartilha.
export function downloadComandaPdf(order: Order, businessName: string) {
  // import dinâmico para não pesar o bundle principal
  import('jspdf').then(({ jsPDF }) => {
    const num = order.order_number ? `#${order.order_number}` : ''
    const dt = new Date(order.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    const tipo = order.order_type === 'pickup' ? 'Retirar no local' : 'Delivery'
    const money = (n: number) => formatCurrency(n || 0)
    const items = order.items ?? []

    // monta a lista de "operações" para calcular a altura antes de criar o PDF
    type Op = { t: 'center' | 'left' | 'row' | 'hr'; a?: string; b?: string; size?: number; bold?: boolean }
    const ops: Op[] = []
    ops.push({ t: 'center', a: businessName, size: 11, bold: true })
    ops.push({ t: 'center', a: `Pedido ${num}`, size: 15, bold: true })
    ops.push({ t: 'center', a: `${dt}${order.customer_name ? ' - ' + order.customer_name : ''}`, size: 8 })
    ops.push({ t: 'hr' })
    for (const it of items) {
      ops.push({ t: 'row', a: `${it.quantity}x ${it.name}`, b: money(it.price * it.quantity), size: 9, bold: true })
      if (it.observations) ops.push({ t: 'left', a: `  ${it.observations}`, size: 8 })
    }
    ops.push({ t: 'hr' })
    ops.push({ t: 'row', a: 'Tipo', b: tipo, size: 9 })
    if (order.neighborhood) ops.push({ t: 'row', a: 'Bairro', b: order.neighborhood, size: 9 })
    if (order.delivery_address && order.order_type !== 'pickup') ops.push({ t: 'left', a: order.delivery_address, size: 8 })
    if (order.customer_phone) ops.push({ t: 'row', a: 'Tel', b: order.customer_phone, size: 9 })
    if (order.payment_method) ops.push({ t: 'row', a: 'Pagto', b: order.payment_method, size: 9 })
    ops.push({ t: 'hr' })
    ops.push({ t: 'row', a: 'Subtotal', b: money(order.subtotal || 0), size: 9 })
    if (order.discount) ops.push({ t: 'row', a: 'Desconto', b: '-' + money(order.discount), size: 9 })
    if (order.delivery_fee) ops.push({ t: 'row', a: 'Entrega', b: money(order.delivery_fee), size: 9 })
    ops.push({ t: 'row', a: 'TOTAL', b: money(order.total || 0), size: 12, bold: true })
    if (order.observations) { ops.push({ t: 'hr' }); ops.push({ t: 'left', a: `Obs: ${order.observations}`, size: 8 }) }
    ops.push({ t: 'hr' })
    ops.push({ t: 'center', a: 'Cardápio Turbo', size: 8 })

    const W = 80, M = 5, LH = 5
    const height = M * 2 + ops.length * LH
    const doc = new jsPDF({ unit: 'mm', format: [W, height] })
    let y = M + 3
    for (const op of ops) {
      doc.setFont('helvetica', op.bold ? 'bold' : 'normal')
      doc.setFontSize(op.size ?? 9)
      if (op.t === 'hr') {
        doc.setDrawColor(150); doc.setLineDashPattern([0.6, 0.6], 0); doc.line(M, y - 2, W - M, y - 2)
      } else if (op.t === 'center') {
        doc.text(op.a || '', W / 2, y, { align: 'center' })
      } else if (op.t === 'left') {
        doc.text(op.a || '', M, y)
      } else if (op.t === 'row') {
        doc.text(op.a || '', M, y)
        doc.text(op.b || '', W - M, y, { align: 'right' })
      }
      y += LH
    }
    doc.save(`comanda-${order.order_number ?? 'pedido'}.pdf`)
  }).catch(() => { /* ignore */ })
}
