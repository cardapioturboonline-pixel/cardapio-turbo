import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/admin'
import { BlogEditor } from '@/components/dashboard/BlogEditor'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) redirect('/dashboard')

  const admin = createAdminClient()
  const { data: post } = await admin.from('blog_posts').select('*').eq('id', id).single()
  if (!post) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar artigo</h1>
      <BlogEditor initial={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? '',
        content: post.content ?? '',
        category: post.category ?? 'Dicas',
        cover_emoji: post.cover_emoji ?? '📝',
        cover_image: post.cover_image ?? '',
        read_minutes: post.read_minutes ?? 5,
        seo_title: post.seo_title ?? '',
        seo_description: post.seo_description ?? '',
        keywords: post.keywords ?? '',
        published: post.published ?? true,
      }} />
    </div>
  )
}
