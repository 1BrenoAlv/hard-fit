import { ArrowUpRight, Check, MonitorPlay } from 'lucide-react'
import Carousel from './Carousel'
import { courseModules } from '../content'

export default function CourseJourney() {
  return (
    <section id="curso" className="page-container py-22 md:py-28">
      <div className="mb-11 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="section-label text-lime">Por dentro do HardFit</p><h2 className="mt-5 text-4xl leading-tight tracking-[-0.04em] md:text-5xl">Pare de improvisar.<br /><span className="text-lime">Aprenda a construir.</span></h2></div><p className="max-w-sm text-sm leading-[1.9] text-muted">Quatro módulos para sair da informação solta e começar a entender o seu treino. Explore a jornada.</p></div>
      <Carousel label="Módulos do curso" slides={courseModules.map(module => ({ id: module.number, label: module.title, content: (
        <article className="grid bg-forest-light md:min-h-100 md:grid-cols-[0.65fr_1.35fr]">
          <div className="relative flex min-h-45 flex-col justify-between overflow-hidden border-b border-lime/15 bg-[#1a2c1c] p-8 md:border-r md:border-b-0 md:p-10"><MonitorPlay size={32} strokeWidth={1.3} className="text-lime" aria-hidden="true" /><span className="absolute -right-2 -bottom-8 text-[12rem] leading-none font-black tracking-tighter text-lime/[0.07]" aria-hidden="true">{module.number}</span><div className="relative mt-6"><p className="text-xs tracking-widest text-lime uppercase">Módulo {module.number}</p><p className="mt-2 text-2xl font-bold">{module.duration}</p></div></div>
          <div className="p-7 md:p-12"><h3 className="text-2xl font-bold tracking-tight md:text-4xl">{module.title}</h3><p className="mt-4 text-sm leading-relaxed text-muted">{module.description}</p><ul className="mt-7 space-y-4">{module.lessons.map(lesson => <li key={lesson} className="flex items-start gap-3 text-sm"><Check size={17} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />{lesson}</li>)}</ul><a href="#oferta" className="mt-8 inline-flex min-h-11 items-center gap-4 text-sm font-bold text-lime hover:text-cream">Quero ter acesso ao curso <ArrowUpRight size={18} aria-hidden="true" /></a></div>
        </article>
      ) }))} />
      <p className="mt-4 text-[11px] leading-relaxed text-muted">Programa ilustrativo do MVP. A grade final será confirmada no lançamento.</p>
    </section>
  )
}
