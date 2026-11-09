import { ArrowUpRight, Check, RotateCcw } from 'lucide-react'

const commonFrustrations = [
  'Começar com tudo e abandonar depois de poucas semanas.',
  'Seguir treinos aleatórios sem entender o que está fazendo.',
  'Passar mais tempo procurando um atalho do que construindo uma rotina.',
]

const mentorshipBenefits = [
  'Um fórum para conversar com os profissionais da HardFit.',
  'Fundamentos para entender o treino e fazer escolhas mais conscientes.',
  'Conhecimento sobre execução, volume e progressão de cargas.',
  'Uma jornada organizada para estudar e aplicar no seu ritmo.',
]

export default function MotivationSection({ onEnrollmentClick }) {
  return (
    <section id="por-que-comecar" className="relative overflow-hidden border-b border-cream/10 bg-[#090e0b] py-22 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -top-30 -right-30 size-100 rounded-full bg-lime/5 blur-3xl" />
      <div className="page-container relative">
        <div className="mx-auto max-w-4xl text-center"><p className="justify-center section-label text-lime">Você se identifica?</p><h2 className="mt-6 text-[clamp(2.1rem,4.5vw,4rem)] leading-[1.1] tracking-[-0.045em]">Cansou de recomeçar<br />e continuar <span className="text-lime">longe do seu objetivo?</span></h2><p className="mx-auto mt-7 max-w-2xl text-base leading-[1.9] text-muted">Se o seu objetivo é sair do sobrepeso, ganhar força ou voltar a se sentir bem treinando, começar sem direção pode ser frustrante. Você merece um caminho que faça sentido para a sua rotina.</p></div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-cream/10 bg-white/[0.025] p-7 md:p-9"><span className="text-[10px] tracking-[0.2em] text-muted uppercase">Parece familiar?</span><h3 className="mt-4 text-2xl font-bold">O ciclo que cansa.</h3><ul className="mt-7 space-y-6">{commonFrustrations.map(frustration => <li key={frustration} className="flex items-start gap-4 text-sm leading-relaxed text-muted"><RotateCcw size={18} className="mt-0.5 shrink-0 text-cream/35" aria-hidden="true" />{frustration}</li>)}</ul></article>
          <article className="rounded-2xl border border-lime/35 bg-lime/[0.045] p-7 md:p-9"><span className="text-[10px] tracking-[0.2em] text-lime uppercase">Por que escolher o HardFit?</span><h3 className="mt-4 text-2xl font-bold">Uma base para seguir em frente.</h3><ul className="mt-7 space-y-6">{mentorshipBenefits.map(benefit => <li key={benefit} className="flex items-start gap-4 text-sm leading-relaxed text-cream/85"><Check size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />{benefit}</li>)}</ul></article>
        </div>
        <div className="mt-12 text-center"><p className="text-xl font-semibold md:text-2xl">Você não precisa esperar a próxima segunda-feira.</p><p className="mt-3 text-sm leading-relaxed text-muted">O primeiro passo pode ser aprender a fazer diferente.</p><button onClick={onEnrollmentClick} className="primary-button mt-7">Quero dar meu primeiro passo <ArrowUpRight size={19} aria-hidden="true" /></button></div>
      </div>
    </section>
  )
}
