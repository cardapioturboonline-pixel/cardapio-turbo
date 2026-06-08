import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function TermosPage() {
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
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Termos de Uso</h1>
        <p className="text-sm text-gray-400 mb-10">Última atualização: 01 de junho de 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar a plataforma Cardápio Turbo ("Plataforma"), você concorda com estes Termos de Uso. Caso não concorde com qualquer disposição, não utilize a Plataforma.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Descrição do Serviço</h2>
            <p>O Cardápio Turbo é uma plataforma SaaS (Software as a Service) que permite a criação e gestão de cardápios digitais com link próprio, QR Code e integração com WhatsApp. O serviço é fornecido pela empresa Cardápio Turbo, com sede no Brasil.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cadastro e Conta</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Para utilizar a Plataforma, é necessário criar uma conta com informações verídicas.</li>
              <li>Você é responsável pela segurança de sua senha e por todas as atividades realizadas em sua conta.</li>
              <li>É proibido compartilhar credenciais de acesso com terceiros.</li>
              <li>Reservamo-nos o direito de suspender contas com informações falsas ou que violem estes Termos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Planos e Pagamentos</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>A Plataforma oferece planos gratuito (Free), profissional (Pro) e empresarial (Business).</li>
              <li>Os planos pagos são cobrados mensalmente via Mercado Pago.</li>
              <li>O cancelamento pode ser feito a qualquer momento, sem multa ou fidelidade.</li>
              <li>Não há reembolso para períodos já pagos e utilizados.</li>
              <li>Os preços podem ser alterados com aviso prévio de 30 dias por e-mail.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Uso Permitido</h2>
            <p>Você concorda em utilizar a Plataforma apenas para fins lícitos e de acordo com estes Termos. É expressamente proibido:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Usar a Plataforma para atividades ilegais ou fraudulentas.</li>
              <li>Publicar conteúdo ofensivo, discriminatório ou que viole direitos de terceiros.</li>
              <li>Tentar acessar sistemas ou dados não autorizados.</li>
              <li>Realizar engenharia reversa ou copiar o código-fonte da Plataforma.</li>
              <li>Usar bots ou automações não autorizadas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Conteúdo do Usuário</h2>
            <p>Você é o único responsável pelo conteúdo que publica na Plataforma (textos, imagens, preços, descrições). Ao publicar conteúdo, você garante que possui os direitos necessários e que o conteúdo não viola direitos de terceiros.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Disponibilidade do Serviço</h2>
            <p>Buscamos manter a Plataforma disponível 24 horas por dia, 7 dias por semana, mas não garantimos disponibilidade ininterrupta. Podemos realizar manutenções programadas com aviso prévio quando possível.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitação de Responsabilidade</h2>
            <p>O Cardápio Turbo não se responsabiliza por perdas de receita, dados ou negócios decorrentes do uso ou indisponibilidade da Plataforma. Nossa responsabilidade máxima é limitada ao valor pago nos últimos 3 meses de assinatura.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Cancelamento e Exclusão</h2>
            <p>Você pode cancelar sua conta a qualquer momento nas configurações da Plataforma. Após o cancelamento, seus dados serão mantidos por 30 dias e então excluídos permanentemente. Também podemos suspender ou encerrar contas que violem estes Termos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Alterações nos Termos</h2>
            <p>Podemos atualizar estes Termos a qualquer momento. Alterações significativas serão comunicadas por e-mail com antecedência mínima de 15 dias. O uso continuado após as alterações implica na aceitação dos novos Termos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Lei Aplicável</h2>
            <p>Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de Campo Grande - MS para dirimir quaisquer controvérsias.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contato</h2>
            <p>Em caso de dúvidas sobre estes Termos, entre em contato pelo e-mail: <a href="mailto:contato@cardapioturbo.com.br" className="text-orange-500 hover:underline">contato@cardapioturbo.com.br</a></p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 mt-8">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2026 Agência LD Marketing. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidade" className="hover:text-orange-500 transition-colors">Política de Privacidade</Link>
            <Link href="/" className="hover:text-orange-500 transition-colors">Início</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
