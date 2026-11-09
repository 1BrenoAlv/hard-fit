import { useState } from 'react'
import { ArrowDown, ArrowUpRight, BookOpen, Check, ChevronDown, Dumbbell, MessagesSquare, MoveUpRight, Target } from 'lucide-react'
import Brand from './components/Brand'
import Header from './components/Header'
import TransformationShowcase from './components/TransformationShowcase'
import EnrollmentDialog from './components/EnrollmentDialog'
import MotivationSection from './components/MotivationSection'
import GoalCarousel from './components/GoalCarousel'
import MentorshipSupport from './components/MentorshipSupport'
import { mentorshipLinks } from './mentorshipLinks'
import { frequentlyAskedQuestions, navigationLinks } from './content'

const methodPrinciples = [
  { icon: BookOpen, title: 'Entenda o porquê.', description: 'Chega de repetir movimentos no automático. Aprenda os fundamentos por trás de um treino bem feito.' },
  { icon: Dumbbell, title: 'Treine com intenção.', description: 'Execução, progressão e planejamento. Cada repetição pode fazer mais sentido na sua rotina.' },
  { icon: Target, title: 'Construa constância.', description: 'O melhor plano é aquele que cabe na sua vida. Desenvolva hábitos para continuar, um treino de cada vez.' },
]

export default function App() {
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false)
  const openEnrollment = () => setIsEnrollmentOpen(true)

  return (
    <>
      <a href="#conteudo" className="sr-only fixed top-3 left-3 z-50 bg-lime p-4 text-forest focus:not-sr-only">Pular para o conteúdo</a>
      <Header onEnrollmentClick={openEnrollment} />
      <main id="conteudo">
        <section id="inicio" className="relative isolate min-h-[710px] overflow-hidden">
          <div className="hero-image absolute inset-0 -z-20 bg-cover bg-center" role="img" aria-label="Academia com equipamentos de musculação" />
          <div className="absolute inset-0 -z-10 bg-forest/10" />
          <div className="page-container relative pt-17 pb-11 md:pt-22">
            <p className="section-label text-lime">Mentoria de musculação</p>
            <h1 className="mt-7 max-w-3xl text-[clamp(2.6rem,6.2vw,5.4rem)] leading-[1.02] font-black tracking-[-0.045em] uppercase">
              Treine com a orientação de <span className="text-lime">quem te ensina.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-[1.8] text-cream/85">
              Aprenda os fundamentos da musculação e tire dúvidas no fórum com os profissionais da HardFit que gravam as aulas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={openEnrollment} className="primary-button">Falar com a HardFit <ArrowUpRight size={19} className="shrink-0" aria-hidden="true" /></button>
              <a href="#acompanhamento" className="secondary-button">Como funciona <ArrowDown size={16} className="shrink-0" aria-hidden="true" /></a>
            </div>
            <div className="mt-7 flex items-center gap-2.5 text-xs text-cream/75">
              <MessagesSquare size={17} className="shrink-0 text-lime" aria-hidden="true" /> Aulas e comunidade na Hotmart
            </div>
            <div className="absolute right-14 bottom-11 hidden max-w-44 border-l border-lime/50 pl-5 lg:block"><span className="text-[10px] tracking-[0.2em] text-lime uppercase">A mentalidade HardFit</span><p className="mt-3 text-xl leading-snug font-semibold">“O processo é o que transforma.”</p></div>
          </div>
        </section>

        <div className="border-y border-lime/20 bg-lime text-forest">
          <div className="page-container flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-5 text-[11px] tracking-[0.18em] uppercase md:justify-between">
            <span>Mais consciência</span><span aria-hidden="true">✳</span><span>Mais consistência</span><span aria-hidden="true" className="hidden sm:block">✳</span><span className="hidden sm:block">Mais evolução</span><span aria-hidden="true" className="hidden md:block">✳</span><span className="hidden md:block">Seu corpo. Seu processo.</span>
          </div>
        </div>

        <section id="evolucao" className="border-y border-lime/15 bg-[#142017] py-20 text-cream md:py-25">
          <div className="page-container">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="section-label text-lime">Um passo de cada vez</p><h2 className="mt-5 text-4xl leading-[1.15] tracking-[-0.04em] md:text-5xl">A mudança acontece<br /><em>no processo.</em></h2></div><p className="max-w-xs text-sm leading-[1.8] text-muted">Mais do que uma imagem de antes e depois. O encontro entre treino, disciplina e constância.</p></div>
            <TransformationShowcase />
            <div className="mt-10 flex items-center justify-between gap-6 border-t border-cream/15 pt-7"><p className="text-xl font-semibold md:text-2xl">O próximo capítulo da sua história começa com você.</p><a href="#oferta" aria-label="Conhecer a oferta da mentoria" className="flex size-12 shrink-0 items-center justify-center rounded-full border border-lime/30 text-lime transition hover:bg-lime hover:text-forest"><ArrowUpRight size={22} /></a></div>
          </div>
        </section>

        <MentorshipSupport />
        <MotivationSection onEnrollmentClick={openEnrollment} />
        <GoalCarousel onEnrollmentClick={openEnrollment} />

        <section id="metodo" className="page-container py-22 md:py-28">
          <div className="grid gap-7 md:grid-cols-2 md:items-end md:gap-20">
            <div><p className="section-label text-lime">A filosofia do clube</p><h2 className="mt-5 text-4xl leading-[1.15] tracking-[-0.04em] md:text-5xl">Menos achismo.<br />Mais <em className="text-lime">direção.</em></h2></div>
            <p className="max-w-md text-base leading-[1.9] text-muted">Você não precisa de mais um treino salvo no celular. Precisa entender o que está fazendo. O HardFit Club aproxima o conhecimento da prática, para você assumir o protagonismo da sua evolução.</p>
          </div>
          <div className="mt-13 grid border-y border-cream/15 md:grid-cols-3">
            {methodPrinciples.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className={`py-9 md:py-10 ${index > 0 ? 'border-t border-cream/15 md:border-t-0 md:border-l md:pl-9' : 'md:pr-8'} ${index === 1 ? 'md:pr-9' : ''}`}>
                <div className="flex items-start justify-between"><Icon size={26} strokeWidth={1.3} className="text-lime" aria-hidden="true" /><span className="text-xs text-cream/30">0{index + 1}</span></div>
                <h3 className="mt-7 text-2xl tracking-tight">{title}</h3><p className="mt-4 max-w-xs text-sm leading-[1.9] text-muted">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="oferta" className="border-y border-cream/10 bg-forest-light py-20 md:py-25">
          <div className="page-container grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-24">
            <div>
              <p className="section-label text-lime">Faça parte da HardFit</p>
              <h2 className="mt-5 max-w-lg text-4xl leading-tight tracking-tight md:text-5xl">O apoio continua <em className="text-lime">depois da aula.</em></h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted">Leve suas dúvidas para o fórum da comunidade, converse com a equipe HardFit e troque experiências com outros alunos.</p>
            </div>
            <div className="rounded-xl border border-lime/35 bg-forest p-6 sm:p-10">
              <p className="section-label text-lime">O que a mentoria inclui</p>
              <ul className="mt-6 space-y-4 text-sm">
                {['Fórum para tirar dúvidas com quem grava as aulas', 'Troca de experiências com outros alunos', 'Aulas gravadas de musculação para estudar no seu ritmo'].map(benefit => (
                  <li key={benefit} className="flex items-start gap-3"><Check size={16} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />{benefit}</li>
                ))}
              </ul>
              <div className="mt-8 grid gap-3">
                {mentorshipLinks.checkout && <a href={mentorshipLinks.checkout} className="primary-button">Inscrever-se pela Hotmart <ArrowUpRight size={18} className="shrink-0" aria-hidden="true" /></a>}
                <button type="button" onClick={openEnrollment} className={mentorshipLinks.checkout ? 'secondary-button' : 'primary-button'}>Falar com a HardFit <ArrowUpRight size={18} className="shrink-0" aria-hidden="true" /></button>
              </div>
              <p className="mt-4 text-center text-xs leading-relaxed text-muted">{mentorshipLinks.checkout ? 'Consulte o valor e as condições na página de compra.' : 'Compra e acesso pela Hotmart. Inscrições em breve.'}</p>
            </div>
          </div>
        </section>

        <section id="duvidas" className="page-container grid gap-10 py-22 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-28">
          <div><p className="section-label text-lime">Tudo às claras</p><h2 className="mt-5 text-4xl leading-[1.15] tracking-[-0.04em] md:text-5xl">Antes do<br /><em className="text-lime">primeiro passo.</em></h2><p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">As respostas para começar com mais confiança.</p></div>
          <div className="border-t border-cream/20">{frequentlyAskedQuestions.map(question => <details key={question.question} className="group border-b border-cream/20"><summary className="flex list-none items-center justify-between gap-5 py-6 text-base transition hover:text-lime"><span>{question.question}</span><ChevronDown size={17} className="shrink-0 text-lime transition group-open:rotate-180" aria-hidden="true" /></summary><p className="pr-6 pb-6 text-sm leading-[1.9] text-muted">{question.answer}</p></details>)}</div>
        </section>

        <section className="bg-lime py-16 text-forest"><div className="page-container flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="text-[10px] tracking-[0.22em] uppercase">O primeiro movimento é seu.</p><h2 className="mt-3 text-3xl tracking-[-0.04em] md:text-4xl">Comece de onde você está. <em>Vá além.</em></h2></div><button onClick={openEnrollment} className="inline-flex min-h-14 shrink-0 items-center justify-center gap-6 border border-forest bg-forest px-7 py-4 text-sm text-cream transition hover:bg-transparent hover:text-forest">Falar com a HardFit <MoveUpRight size={18} aria-hidden="true" /></button></div></section>
      </main>
      <footer className="page-container pt-14 pb-7"><div className="flex flex-col justify-between gap-8 border-b border-cream/15 pb-10 sm:flex-row sm:items-start"><div><Brand /><p className="mt-5 max-w-xs text-xs leading-[1.8] text-muted">Um clube para quem acredita que a evolução<br />se constrói, um dia de cada vez.</p></div><nav aria-label="Navegação do rodapé" className="flex flex-wrap gap-x-7 gap-y-4 text-xs text-muted">{navigationLinks.map(link => <a key={link.href} href={link.href} className="transition hover:text-lime">{link.label}</a>)}</nav><a href="#inicio" aria-label="Voltar ao início" className="flex size-10 items-center justify-center rounded-full border border-cream/25 transition hover:border-lime hover:text-lime"><ArrowUpRight size={17} /></a></div><div className="flex flex-col justify-between gap-3 pt-6 text-[10px] leading-relaxed text-muted/75 sm:flex-row"><p>© {new Date().getFullYear()} HardFit Club.</p><p>Mentoria de musculação · Aulas e comunidade na Hotmart</p></div></footer>
      <EnrollmentDialog isOpen={isEnrollmentOpen} onClose={() => setIsEnrollmentOpen(false)} />
    </>
  )
}
