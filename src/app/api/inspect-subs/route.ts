import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  if (url.searchParams.get('secret') !== 'turbo-seed-2026') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data, error, count } = await supabase.from('subscriptions').select('*', { count: 'exact' }).limit(5)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const columns = data && data.length ? Object.keys(data[0]) : []
  return NextResponse.json({ count, columns, sample: data })
}
