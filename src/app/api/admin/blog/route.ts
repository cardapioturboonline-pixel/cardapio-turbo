import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/admin'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return null
  return user
}

// CREATE
export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const body = await req.json()
  if (!body.title || !body.content) {
    return NextResponse.json({ error: 'title and content required' }, { status: 400 })
  }

  const slug = body.slug?.trim() || slugify(body.title)
  const supabase = createAdminClient()

  const { data, error } = await supabase.from('blog_posts').insert({
    title: body.title,
    slug,
    excerpt: body.excerpt || '',
    content: body.content,
    category: body.category || 'Dicas',
    cover_emoji: body.cover_emoji || '📝',
    author: 'Equipe Cardápio Turbo',
    read_minutes: body.read_minutes || 5,
    seo_title: body.seo_title || null,
    seo_description: body.seo_description || null,
    keywords: body.keywords || null,
    published: body.published ?? true,
  }).select('id, slug').single()

  if (error) {
    const msg = error.code === '23505' ? 'Já existe um artigo com esse slug/URL' : error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  return NextResponse.json({ ok: true, id: data.id, slug: data.slug })
}

// UPDATE
export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const supabase = createAdminClient()
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const f of ['title', 'slug', 'excerpt', 'content', 'category', 'cover_emoji', 'read_minutes', 'seo_title', 'seo_description', 'keywords', 'published']) {
    if (f in body) updates[f] = body[f]
  }

  const { error } = await supabase.from('blog_posts').update(updates).eq('id', body.id)
  if (error) {
    const msg = error.code === '23505' ? 'Já existe um artigo com esse slug/URL' : error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}

// DELETE
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
