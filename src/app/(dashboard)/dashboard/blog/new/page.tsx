import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'
import { BlogEditor } from '@/components/dashboard/BlogEditor'

export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) redirect('/dashboard')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo artigo</h1>
      <BlogEditor />
    </div>
  )
}
