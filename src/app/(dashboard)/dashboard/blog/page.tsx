import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Pencil, ExternalLink, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/admin'
import { DeletePostButton } from './DeletePostButton'

export const dynamic = 'force-dynamic'

interface Post {
  id: string
  title: string
  slug: string
  category: string
  cover_emoji: string
  published: boolean
  views: number
  published_at: string
}

export default async function BlogAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) redirect('/dashboard')

  const admin = createAdminClient()
  const { data } = await admin
    .from('blog_posts')
    .select('id, title, slug, category, cover_emoji, published, views, published_at')
    .order('published_at', { ascending: false })

  const posts = (data ?? []) as Post[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-sm text-gray-500">{posts.length} artigos · gerencie o conteúdo do site</p>
        </div>
        <Link href="/dashboard/blog/new" className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus className="h-4 w-4" /> Novo artigo
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <FileText className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="font-medium text-gray-900">Nenhum artigo ainda</h3>
          <p className="text-sm text-gray-500 mt-1">Escreva seu primeiro artigo para atrair tráfego do Google</p>
          <Link href="/dashboard/blog/new" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
            <Plus className="h-4 w-4" /> Escrever artigo
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <div key={post.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <div className="h-12 w-12 shrink-0 rounded-lg bg-orange-50 flex items-center justify-center text-2xl">{post.cover_emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                  {post.published
                    ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Publicado</span>
                    : <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">Rascunho</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{post.category} · {post.views} visualizações</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {post.published && (
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="rounded-md p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50" title="Ver no site">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Link href={`/dashboard/blog/${post.id}/edit`} className="rounded-md p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50" title="Editar">
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
