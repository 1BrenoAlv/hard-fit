import { MessageCircle, MessagesSquare, ShoppingBag } from 'lucide-react'

const mentorshipSteps = [
  {
    icon: MessageCircle,
    title: 'Fale com a HardFit',
    description: 'Deixe seu contato e diga o que você quer saber sobre a mentoria.',
  },
  {
    icon: ShoppingBag,
    title: 'Inscreva-se na Hotmart',
    description: 'Quando as inscrições abrirem, você poderá conferir as condições e se inscrever pela Hotmart.',
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
      </div>
    </section>
  )
}
