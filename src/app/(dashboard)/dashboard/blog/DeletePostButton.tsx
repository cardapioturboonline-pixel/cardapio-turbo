'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Excluir o artigo "${title}"? Esta ação não pode ser desfeita.`)) return
    const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Erro ao excluir'); return }
    toast.success('Artigo excluído!')
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="rounded-md p-2 text-gray-400 hover:text-red-500 hover:bg-red-50" title="Excluir">
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
