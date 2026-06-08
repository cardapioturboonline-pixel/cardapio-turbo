import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Cardápio Turbo</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">← Voltar</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Política de Privacidade</h1>
        <p className="text-sm text-gray-400 mb-10">Última atualização: 01 de junho de 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introdução</h2>
            <p>O Cardápio Turbo valoriza a privacidade dos seus usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Dados que Coletamos</h2>
            <p className="mb-2"><strong>2.1 Dados fornecidos por você:</strong></p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Nome completo e endereço de e-mail (no cadastro)</li>
              <li>Número de WhatsApp e cidade (nas configurações da loja)</li>
              <li>Informações do negócio (nome, logo, produtos, categorias, preços)</li>
              <li>Redes sociais e links (opcionais)</li>
            </ul>
            <p className="mb-2"><strong>2.2 Dados coletados automaticamente:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Endereço IP e tipo de navegador</li>
              <li>Dados de acesso ao cardápio (visualizações, cliques no WhatsApp)</li>
              <li>Cookies de sessão e autenticação</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Como Usamos seus Dados</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Fornecer e operar a Plataforma</li>
              <li>Gerar relatórios de desempenho do seu cardápio</li>
              <li>Enviar comunicações sobre o serviço (atualizações, alertas de conta)</li>
              <li>Processar pagamentos das assinaturas</li>
              <li>Melhorar a Plataforma com base no uso</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Compartilhamento de Dados</h2>
            <p>Não vendemos seus dados pessoais. Podemos compartilhá-los apenas com:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Supabase:</strong> infraestrutura de banco de dados e autenticação</li>
              <li><strong>Vercel:</strong> hospedagem da Plataforma</li>
              <li><strong>Mercado Pago:</strong> processamento de pagamentos</li>
              <li><strong>Autoridades competentes:</strong> quando exigido por lei</li>
            </ul>
            <p className="mt-3">Todos os parceiros seguem padrões de segurança adequados e estão sujeitos a acordos de confidencialidade.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies</h2>
            <p>Utilizamos cookies essenciais para autenticação e funcionamento da Plataforma. Não utilizamos cookies de rastreamento ou publicidade de terceiros.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Segurança dos Dados</h2>
            <p>Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Criptografia em trânsito (HTTPS/TLS)</li>
              <li>Autenticação segura via Supabase Auth</li>
              <li>Controle de acesso por Row Level Security (RLS)</li>
              <li>Backups regulares dos dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Seus Direitos (LGPD)</h2>
            <p>Conforme a LGPD, você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Acesso:</strong> solicitar uma cópia dos seus dados</li>
              <li><strong>Correção:</strong> corrigir dados incompletos ou incorretos</li>
              <li><strong>Exclusão:</strong> solicitar a exclusão dos seus dados</li>
              <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado</li>
              <li><strong>Revogação:</strong> revogar o consentimento a qualquer momento</li>
            </ul>
            <p className="mt-3">Para exercer seus direitos, entre em contato: <a href="mailto:privacidade@cardapioturbo.com.br" className="text-orange-500 hover:underline">privacidade@cardapioturbo.com.br</a></p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Retenção de Dados</h2>
            <p>Mantemos seus dados enquanto sua conta estiver ativa. Após o cancelamento, os dados são retidos por 30 dias e então excluídos permanentemente, salvo obrigação legal de retenção.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Menores de Idade</h2>
            <p>Nossa Plataforma não é direcionada a menores de 18 anos. Não coletamos intencionalmente dados de menores de idade.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Alterações nesta Política</h2>
            <p>Podemos atualizar esta Política periodicamente. Notificaremos sobre alterações significativas por e-mail. O uso continuado da Plataforma após as alterações implica na aceitação da nova Política.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contato e Encarregado (DPO)</h2>
            <p>Para questões relacionadas à privacidade e proteção de dados:</p>
            <ul className="list-none mt-2 space-y-1">
              <li>📧 <a href="mailto:privacidade@cardapioturbo.com.br" className="text-orange-500 hover:underline">privacidade@cardapioturbo.com.br</a></li>
              <li>🌐 <a href="https://cardapioturbo.com.br" className="text-orange-500 hover:underline">cardapioturbo.com.br</a></li>
            </ul>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 mt-8">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2026 Agência LD Marketing. Todos os direitos reservados.</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/sobre" className="hover:text-orange-500 transition-colors">Sobre</Link>
            <Link href="/contato" className="hover:text-orange-500 transition-colors">Contato</Link>
            <Link href="/termos" className="hover:text-orange-500 transition-colors">Termos de Uso</Link>
            <Link href="/" className="hover:text-orange-500 transition-colors">Início</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
