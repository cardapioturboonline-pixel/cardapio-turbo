import { Resend } from 'resend'
import { welcomeEmail, proWelcomeEmail, winbackEmail } from './templates'

const FROM = 'Cardápio Turbo <ola@cardapioturbo.com.br>'

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn('[email] RESEND_API_KEY not configured — skipping email send')
    return null
  }
  return new Resend(key)
}

export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  const resend = getClient()
  if (!resend) return false
  try {
    const { subject, html } = welcomeEmail(name)
    const { error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) { console.error('[email] welcome send error:', error); return false }
    return true
  } catch (err) {
    console.error('[email] welcome send exception:', err)
    return false
  }
}

export async function sendProWelcomeEmail(to: string, name: string): Promise<boolean> {
  const resend = getClient()
  if (!resend) return false
  try {
    const { subject, html } = proWelcomeEmail(name)
    const { error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) { console.error('[email] pro welcome send error:', error); return false }
    return true
  } catch (err) {
    console.error('[email] pro welcome send exception:', err)
    return false
  }
}

export async function sendWinbackEmail(to: string, name: string): Promise<boolean> {
  const resend = getClient()
  if (!resend) return false
  try {
    const { subject, html } = winbackEmail(name)
    const { error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) { console.error('[email] winback send error:', error); return false }
    return true
  } catch (err) {
    console.error('[email] winback send exception:', err)
    return false
  }
}
