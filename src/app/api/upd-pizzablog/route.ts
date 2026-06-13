import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
const CONTENT = `
<p>Quem tem pizzaria sabe: a pizza meio a meio é uma das mais pedidas, mas também uma das que mais geram dúvida na hora de cobrar. Quando o cliente escolhe dois sabores com preços diferentes, qual valor usar? Cobrar errado significa perder margem ou deixar o cliente com a sensação de que pagou caro. A boa notícia é que dá para automatizar esse cálculo no seu cardápio digital.</p>
<p>Veja como funciona o preço da pizza meio a meio e como ativar o modo pizzaria no Cardápio Turbo para o cálculo sair certo, sem você precisar fazer conta na hora do pedido.</p>

<h2>Como funciona o preço da pizza meio a meio</h2>
<p>Existem dois métodos comuns no mercado. No primeiro, cobra-se o valor do sabor mais caro entre os dois escolhidos. No segundo, soma-se metade do preço de cada sabor, ou seja, a média dos dois. O Cardápio Turbo usa o método proporcional, a média, que costuma ser o mais justo para o cliente.</p>
<p>Veja um exemplo prático com o método proporcional:</p>
<ul>
<li><strong>Sabor 1 (Calabresa):</strong> preço cheio R$ 60. Metade = R$ 30.</li>
<li><strong>Sabor 2 (Quatro Queijos):</strong> preço cheio R$ 80. Metade = R$ 40.</li>
<li><strong>Valor final da pizza:</strong> R$ 30 + R$ 40 = <strong>R$ 70</strong>.</li>
</ul>
<p>Repare que o cálculo é simples, mas fazer isso na correria de um dia movimentado, pizza após pizza, é onde os erros acontecem. Por isso vale a pena deixar o sistema calcular sozinho.</p>

<h2>Por que automatizar esse cálculo</h2>
<ul>
<li><strong>Sem erro de conta:</strong> o preço sai certo em todo pedido, independentemente da combinação de sabores.</li>
<li><strong>Mais agilidade:</strong> o cliente monta a pizza sozinho e o pedido já chega com o valor correto.</li>
<li><strong>Transparência:</strong> o cliente vê o preço na hora e fecha o pedido com confiança.</li>
<li><strong>Menos retrabalho:</strong> você não precisa revisar valor de pizza no WhatsApp.</li>
</ul>

<h2>Como ativar o modo pizzaria no Cardápio Turbo</h2>

<h3>1. Crie a categoria de pizzas</h3>
<p>No painel, crie uma categoria chamada Pizzas para agrupar todos os sabores.</p>

<h3>2. Cadastre cada sabor com os tamanhos</h3>
<p>Ao cadastrar um produto, ative o <strong>Modo pizza</strong> e informe os <strong>tamanhos com preço</strong> daquele sabor, por exemplo Broto e Grande, cada um com o seu valor. Faça isso para cada sabor da casa.</p>

<h3>3. Ative o meio a meio</h3>
<p>Na configuração do sabor, escolha permitir <strong>meio a meio (2 sabores)</strong>. Pronto: no cardápio, o cliente vai poder montar a pizza com dois sabores. Se preferir, você também pode deixar o sabor apenas como pizza inteira.</p>

<h3>4. O cliente monta e o preço sai sozinho</h3>
<p>No cardápio, o cliente escolhe o tamanho, seleciona inteira ou meio a meio e, no caso do meio a meio, escolhe o segundo sabor. O preço aparece na hora, já como a média dos dois sabores, e o pedido chega no seu WhatsApp com o valor correto.</p>

<h2>Pizza inteira, bebidas e tudo no mesmo cardápio</h2>
<p>O modo pizza é ativado por produto, não no cardápio inteiro. Ou seja, você pode ter pizzas inteiras e pizzas meio a meio e, ao mesmo tempo, cadastrar bebidas, sobremesas, bordas e qualquer outro item como produto normal, com preço único, cada um na sua categoria. A pizza inteira usa o preço cheio do sabor no tamanho escolhido, e o meio a meio é apenas uma opção que você libera quando quiser. Assim dá para montar a pizzaria completa em um só lugar, sem deixar nada de fora.</p>

<h2>Dica para vender mais pizzas</h2>
<p>Capriche nas fotos dos sabores e use nomes que dão água na boca. Combine o cardápio digital com cupons e combos, por exemplo uma pizza grande com refrigerante, para aumentar o ticket médio. E não esqueça de divulgar o link do cardápio nas redes e no status do WhatsApp.</p>

<h2>Comece agora</h2>
<p>O modo pizzaria está disponível no plano Pro. Em poucos minutos você cadastra os tamanhos, ativa o meio a meio e deixa o cálculo no automático.</p>
<p><a href="https://cardapioturbo.com.br/register"><strong>Crie seu cardápio digital grátis no Cardápio Turbo</strong></a> e teste por 7 dias, sem cartão de crédito. Monte sua pizzaria digital e receba os pedidos, com o preço do meio a meio sempre certo, direto no WhatsApp.</p>
`
export async function GET(req: Request) {
  const url = new URL(req.url)
  if (url.searchParams.get('secret') !== 'turbo-seed-2026') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { error } = await supabase.from('blog_posts').update({ content: CONTENT, updated_at: new Date().toISOString() }).eq('slug', 'pizza-meio-a-meio-preco-cardapio-digital')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
