import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/admin'

export const dynamic = 'force-dynamic'

// Ação de admin: remover definitivamente um negócio (usado para limpar contas de teste).
// Só admins autorizados. IRREVERSÍVEL — apaga o restaurante e, por cascade, seus dados.
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: { businessId?: string; confirmName?: string } = {}
  try { body = await req.json() } catch { /* ignore */ }
  const businessId = body.businessId
  if (!businessId) return NextResponse.json({ error: 'sem business' }, { status: 400 })

  const admin = createAdminClient()

  // Confere o nome informado como trava de segurança
  const { data: biz } = await admin
    .from('businesses')
    .select('id, name, user_id')
    .eq('id', businessId)
    .single()
  if (!biz) return NextResponse.json({ error: 'negócio não encontrado' }, { status: 404 })

  if ((body.confirmName || '').trim() !== (biz.name || '').trim()) {
    return NextResponse.json({ error: 'nome de confirmação não confere' }, { status: 400 })
  }

  const { error } = await admin.from('businesses').delete().eq('id', businessId)
  if (error) {
    console.error('[delete-business] error:', error)
    return NextResponse.json({ error: 'falha ao remover' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
