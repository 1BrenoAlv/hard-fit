import { MessageCircle, MessagesSquare, ShoppingBag } from 'lucide-react'

const mentorshipSteps = [
  {
    icon: MessageCircle,
    title: 'Fale com a HardFit',
    description: 'Comece pelo Instagram, WhatsApp ou pelo botão de contato aqui no site. Conte seu objetivo e tire suas dúvidas sobre a mentoria.',
  },
  {
    icon: ShoppingBag,
    title: 'Inscreva-se na Hotmart',
    description: 'Quando estiver pronto, siga para a página da Hotmart para conferir as condições e concluir a compra.',
  },
  {
    icon: MessagesSquare,
    title: 'Aprenda e converse no fórum',
    description: 'Após a compra, acesse as aulas e o fórum na Hotmart. Publique dúvidas, troque experiências e converse com os profissionais da HardFit que gravam as aulas.',
  },
]

export default function MentorshipSupport() {
  return (
    <section id="acompanhamento" className="border-b border-cream/10 bg-forest-light py-16 md:py-24">
      <div className="page-container">
        <p className="section-label text-lime">Como funciona o acompanhamento</p>
        <h2 className="mt-5 max-w-3xl text-4xl leading-tight tracking-tight md:text-5xl">
          Aprenda nas aulas. <em className="text-lime">Converse no fórum.</em>
        </h2>
        <ol className="mt-9 grid gap-4 md:grid-cols-3">
          {mentorshipSteps.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="rounded-xl border border-cream/15 bg-forest p-6">
              <div className="flex items-center justify-between text-lime">
                <Icon size={24} aria-hidden="true" />
                <span aria-hidden="true">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 rounded-xl border border-lime/25 bg-lime/5 p-6 md:p-8">
          <p className="section-label text-lime">Exemplo de conversa no fórum</p>
          <p className="mt-4 text-sm leading-relaxed"><strong>Aluno:</strong> “Vi a aula sobre progressão, mas fiquei em dúvida sobre o que anotar depois do treino.”</p>
          <p className="mt-2 text-sm leading-relaxed text-muted"><strong>Equipe HardFit:</strong> “Conte no tópico o que você já registra. A gente te ajuda a ligar o que foi explicado na aula ao seu dia a dia na academia.”</p>
        </div>
      </div>
    </section>
  )
}
