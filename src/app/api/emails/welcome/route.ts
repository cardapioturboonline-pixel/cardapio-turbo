import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email/send'

// Sends the welcome email to the currently authenticated user.
// Called by the onboarding flow once the business is created.
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
    }

    const name = (user.user_metadata?.full_name as string) || user.email.split('@')[0]
    const ok = await sendWelcomeEmail(user.email, name)

    return NextResponse.json({ ok })
  } catch (err) {
    console.error('[api/emails/welcome] error:', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
