// Branded HTML email templates for Cardápio Turbo

const BRAND = '#f97316'
const SITE_URL = 'https://cardapioturbo.com.br'
const SUPPORT_WHATSAPP = 'https://wa.me/5567992741982'

function baseLayout(content: string, preheader: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cardápio Turbo</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <span style="display:none;font-size:1px;color:#f3f4f6;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND} 0%,#ea580c 100%);padding:32px 40px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td style="background-color:#ffffff;width:48px;height:48px;border-radius:12px;text-align:center;vertical-align:middle;font-size:28px;">⚡</td>
                  <td style="padding-left:12px;color:#ffffff;font-size:24px;font-weight:bold;">Cardápio Turbo</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#1a1a1a;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;">Cardápio digital profissional para o seu negócio</p>
              <p style="margin:0;color:#6b7280;font-size:12px;">
                <a href="${SITE_URL}" style="color:${BRAND};text-decoration:none;">cardapioturbo.com.br</a>
                &nbsp;•&nbsp;
                <a href="${SUPPORT_WHATSAPP}" style="color:${BRAND};text-decoration:none;">Suporte via WhatsApp</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="color:#9ca3af;font-size:11px;margin-top:16px;">© 2026 Agência LD Marketing. Todos os direitos reservados.</p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function button(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:28px auto;">
    <tr>
      <td style="background-color:${BRAND};border-radius:12px;">
        <a href="${url}" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:16px;font-weight:bold;text-decoration:none;">${text}</a>
      </td>
    </tr>
  </table>`
}

export function welcomeEmail(name: string): { subject: string; html: string } {
  const firstName = name?.split(' ')[0] || 'amigo(a)'
  const content = `
    <h1 style="margin:0 0 16px;color:#1a1a1a;font-size:26px;font-weight:bold;">Bem-vindo(a), ${firstName}! 🎉</h1>
    <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.6;">
      Que bom ter você no <strong>Cardápio Turbo</strong>! Sua conta foi criada com sucesso e você já pode começar a montar o cardápio digital do seu negócio.
    </p>
    <p style="margin:0 0 8px;color:#4b5563;font-size:16px;line-height:1.6;"><strong>Primeiros passos:</strong></p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 8px;">
      <tr><td style="padding:8px 0;color:#4b5563;font-size:15px;">🍔 &nbsp;Cadastre seus produtos e categorias</td></tr>
      <tr><td style="padding:8px 0;color:#4b5563;font-size:15px;">🎨 &nbsp;Personalize as cores e o tema</td></tr>
      <tr><td style="padding:8px 0;color:#4b5563;font-size:15px;">📱 &nbsp;Gere seu QR Code e compartilhe</td></tr>
      <tr><td style="padding:8px 0;color:#4b5563;font-size:15px;">💬 &nbsp;Receba pedidos direto no WhatsApp</td></tr>
    </table>
    <p style="margin:16px 0 0;color:#4b5563;font-size:16px;line-height:1.6;">
      Você tem <strong>7 dias grátis</strong> para testar tudo. Bora começar?
    </p>
    ${button('Acessar meu painel', SITE_URL + '/dashboard')}
    <p style="margin:8px 0 0;color:#9ca3af;font-size:14px;text-align:center;line-height:1.6;">
      Precisa de ajuda? Estamos a um clique no <a href="${SUPPORT_WHATSAPP}" style="color:${BRAND};">WhatsApp</a>.
    </p>
  `
  return {
    subject: '🎉 Bem-vindo ao Cardápio Turbo!',
    html: baseLayout(content, 'Sua conta foi criada com sucesso. Comece agora!'),
  }
}

export function proWelcomeEmail(name: string): { subject: string; html: string } {
  const firstName = name?.split(' ')[0] || 'amigo(a)'
  const content = `
    <h1 style="margin:0 0 16px;color:#1a1a1a;font-size:26px;font-weight:bold;">Você agora é Pro, ${firstName}! ⭐</h1>
    <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.6;">
      Sua assinatura do <strong>Plano Pro</strong> foi confirmada com sucesso. Obrigado por confiar no Cardápio Turbo para fazer seu negócio crescer! 🚀
    </p>
    <p style="margin:0 0 8px;color:#4b5563;font-size:16px;line-height:1.6;"><strong>Tudo que você desbloqueou:</strong></p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 8px;">
      <tr><td style="padding:7px 0;color:#4b5563;font-size:15px;">✅ &nbsp;Produtos e categorias ilimitados</td></tr>
      <tr><td style="padding:7px 0;color:#4b5563;font-size:15px;">✅ &nbsp;QR Code personalizado com sua logo</td></tr>
      <tr><td style="padding:7px 0;color:#4b5563;font-size:15px;">✅ &nbsp;Temas premium e personalização completa</td></tr>
      <tr><td style="padding:7px 0;color:#4b5563;font-size:15px;">✅ &nbsp;Cupons de desconto</td></tr>
      <tr><td style="padding:7px 0;color:#4b5563;font-size:15px;">✅ &nbsp;Relatórios avançados de vendas</td></tr>
      <tr><td style="padding:7px 0;color:#4b5563;font-size:15px;">✅ &nbsp;Sem marca d'água no cardápio</td></tr>
    </table>
    ${button('Explorar recursos Pro', SITE_URL + '/dashboard')}
    <p style="margin:8px 0 0;color:#9ca3af;font-size:14px;text-align:center;line-height:1.6;">
      Sua assinatura é mensal e pode ser cancelada quando quiser.<br>
      Dúvidas? Fale conosco no <a href="${SUPPORT_WHATSAPP}" style="color:${BRAND};">WhatsApp</a>.
    </p>
  `
  return {
    subject: '⭐ Bem-vindo ao Plano Pro do Cardápio Turbo!',
    html: baseLayout(content, 'Sua assinatura Pro foi confirmada. Aproveite todos os recursos!'),
  }
}

export function winbackEmail(name: string): { subject: string; html: string } {
  const firstName = name?.split(' ')[0] || 'amigo(a)'
  const content = `
    <h1 style="margin:0 0 16px;color:#1a1a1a;font-size:26px;font-weight:bold;">Sentimos sua falta, ${firstName}! 🧡</h1>
    <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.6;">
      Seu período de teste no <strong>Cardápio Turbo</strong> terminou e percebemos que você ainda não ativou o Plano Pro. Que tal voltar e deixar seu cardápio trabalhando por você de novo?
    </p>
    <p style="margin:0 0 8px;color:#4b5563;font-size:16px;line-height:1.6;"><strong>Com o Pro você tem:</strong></p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 8px;">
      <tr><td style="padding:7px 0;color:#4b5563;font-size:15px;">📲 &nbsp;Pedidos direto no WhatsApp, sem comissão</td></tr>
      <tr><td style="padding:7px 0;color:#4b5563;font-size:15px;">🛍️ &nbsp;Produtos e categorias ilimitados</td></tr>
      <tr><td style="padding:7px 0;color:#4b5563;font-size:15px;">🔔 &nbsp;Painel de pedidos em tempo real</td></tr>
      <tr><td style="padding:7px 0;color:#4b5563;font-size:15px;">🎟️ &nbsp;Cupons, fidelidade e relatórios</td></tr>
      <tr><td style="padding:7px 0;color:#4b5563;font-size:15px;">🍕 &nbsp;Modo pizzaria com meio a meio automático</td></tr>
    </table>
    <p style="margin:16px 0 0;color:#4b5563;font-size:16px;line-height:1.6;">
      Seus dados continuam salvos. É só reativar e seu cardápio volta no ar na hora.
    </p>
    ${button('Reativar meu Pro', SITE_URL + '/dashboard/plans')}
    <p style="margin:8px 0 0;color:#9ca3af;font-size:14px;text-align:center;line-height:1.6;">
      Ficou com alguma dúvida? Estamos no <a href="${SUPPORT_WHATSAPP}" style="color:${BRAND};">WhatsApp</a> pra te ajudar.
    </p>
  `
  return {
    subject: `${firstName}, seu cardápio digital está te esperando 🧡`,
    html: baseLayout(content, 'Volte ao Cardápio Turbo Pro e reative seu cardápio.'),
  }
}
