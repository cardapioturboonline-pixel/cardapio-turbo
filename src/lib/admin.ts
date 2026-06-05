// E-mails com acesso ao painel administrativo (blog da plataforma).
// Pode ser sobrescrito pela env ADMIN_EMAILS (separados por vírgula).
const DEFAULT_ADMINS = [
  'felipdsouza@gmail.com',
  'cardapioturboonline@gmail.com',
]

export function getAdminEmails(): string[] {
  const fromEnv = process.env.ADMIN_EMAILS
  if (fromEnv) return fromEnv.split(',').map(e => e.trim().toLowerCase())
  return DEFAULT_ADMINS
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}
