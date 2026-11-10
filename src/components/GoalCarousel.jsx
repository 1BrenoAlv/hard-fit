import { ArrowUpRight, Check } from 'lucide-react'
import Carousel from './Carousel'

const trainingGoals = [
  {
    id: 'fat-loss',
    imageSetting: 'fatLossImageUrl',
    label: 'Treinar com foco em reduzir gordura',
    eyebrow: 'Seu objetivo, seu processo',
    title: 'Quer reduzir gordura e não sabe por onde começar?',
    description: 'Entenda o papel da musculação, do planejamento e da constância na sua jornada. Aprenda a olhar para a evolução além do número na balança.',
    points: ['Fundamentos para começar', 'Uma rotina possível de manter', 'Progresso além da balança'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=85',
    alt: 'Ambiente de academia com equipamentos para treinar',
  },
  {
    id: 'strength',
    imageSetting: 'strengthImageUrl',
    label: 'Ganhar força com mais consciência',
    eyebrow: 'Cada repetição conta',
    title: 'Treina há um tempo, mas sente que está no mesmo lugar?',
    description: 'Descubra como execução, volume e progressão se conectam. Estude os fundamentos para conversar com seu professor e entender melhor o seu treino.',
    points: ['Execução com mais consciência', 'Princípios da progressão', 'Organização do treinamento'],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=85',
    alt: 'Pessoa praticando musculação em uma academia',
  },
  {
    id: 'consistency',
    imageSetting: 'consistencyImageUrl',
    label: 'Voltar a treinar e manter a rotina',
    eyebrow: 'Comece. Ajuste. Continue.',
    title: 'Cansou de começar com tudo e parar no meio do caminho?',
    description: 'Conheça os pilares de uma rotina que cabe na vida real. Aprenda a organizar a semana, respeitar o descanso e acompanhar o próprio processo.',
    points: ['Planejamento da semana', 'Descanso e recuperação', 'Hábitos para continuar'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=85',
    alt: 'Ambiente de atividade física e construção de hábitos',
  },
]

export default function GoalCarousel({ onEnrollmentClick, settings }) {
  return (
    <section className="page-container py-20 md:py-25" id="objetivos">
      <div className="mb-10 text-center"><p className="section-label justify-center text-lime">O ponto de partida é seu</p><h2 className="mt-5 text-3xl leading-tight tracking-[-0.04em] md:text-5xl">Qual é a sua <span className="text-lime">próxima conquista?</span></h2><p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted">Diferentes objetivos. Uma base em comum: entender o treino para construir o seu caminho.</p></div>
      <Carousel label="Objetivos de treino" slides={trainingGoals.map(goal => ({ id: goal.id, label: goal.label, content: (
        <article className="grid min-h-115 grow bg-forest-light md:grid-cols-[0.85fr_1.15fr]">
          <div className="relative h-58 overflow-hidden bg-forest md:h-auto"><img src={settings?.[goal.imageSetting] || goal.image} alt={settings?.[goal.imageSetting] ? goal.label : goal.alt} loading="lazy" width="1000" height="1200" className="absolute inset-0 h-full w-full object-cover opacity-60" /><div className="absolute inset-0 bg-linear-to-t from-forest via-transparent to-forest/10" /><span className="absolute bottom-6 left-6 rounded-full border border-lime/40 bg-forest/80 px-4 py-2 text-[10px] tracking-widest text-lime uppercase">{goal.eyebrow}</span></div>
          <div className="flex flex-col justify-center p-7 md:p-12"><h3 className="max-w-lg text-2xl leading-tight font-bold tracking-tight md:text-3xl">{goal.title}</h3><p className="mt-5 text-sm leading-[1.9] text-muted">{goal.description}</p><ul className="mt-6 space-y-3">{goal.points.map(point => <li key={point} className="flex items-center gap-3 text-xs text-cream/80"><Check size={15} className="text-lime" aria-hidden="true" />{point}</li>)}</ul><button onClick={onEnrollmentClick} className="mt-8 inline-flex min-h-11 items-center gap-4 self-start text-sm font-bold text-lime transition hover:text-cream">Quero começar com direção <ArrowUpRight size={18} aria-hidden="true" /></button></div>
        </article>
      ) }))} />
    </section>
  )
}
