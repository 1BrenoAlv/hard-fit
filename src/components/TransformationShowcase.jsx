import { useState } from 'react'
import { ArrowRight, TrendingUp } from 'lucide-react'
import Carousel from './Carousel'

function EvolutionComparison({ evolution }) {
  return (
    <figure className="grow bg-forest-light p-3 sm:p-5">
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {[
          { label: 'Antes', url: evolution.beforeImageUrl },
          { label: 'Depois', url: evolution.afterImageUrl },
        ].map(({ label, url }) => (
          <div key={label} className="relative overflow-hidden rounded-lg bg-forest">
            <img src={url} alt={`${label} · ${evolution.title}`} loading="lazy" className="aspect-[4/5] max-h-[520px] w-full object-contain" />
            <span className="absolute bottom-2 left-2 rounded bg-forest/90 px-2 py-1 text-xs font-semibold text-lime sm:bottom-4 sm:left-4">{label}</span>
          </div>
        ))}
      </div>
      <figcaption className="mt-4 text-sm font-semibold break-words">{evolution.title}</figcaption>
    </figure>
  )
}

export default function TransformationShowcase({ evolutions }) {
  const [isImageUnavailable, setIsImageUnavailable] = useState(false)

  if (evolutions.length > 0) {
    return (
      <div className="mt-11">
        {evolutions.length === 1 ? (
          <div className="overflow-hidden rounded-2xl border border-lime/20">
            <EvolutionComparison evolution={evolutions[0]} />
          </div>
        ) : (
          <Carousel label="Evoluções de alunos" slides={evolutions.map(evolution => ({
            id: evolution.id,
            label: evolution.title,
            content: <EvolutionComparison evolution={evolution} />,
          }))} />
        )}
        <p className="mt-4 text-[11px] text-cream/60">Cada pessoa tem seu ritmo. Resultados individuais variam.</p>
      </div>
    )
  }

  return (
    <figure className="mt-11">
      <div className="overflow-hidden border border-forest/15 bg-forest">
        {isImageUnavailable ? (
          <div className="flex min-h-80 flex-col items-center justify-center gap-7 p-8 text-center text-cream sm:min-h-110">
            <div className="flex items-center gap-8 text-2xl font-semibold text-lime"><span>Seu começo</span><ArrowRight size={25} strokeWidth={1} aria-hidden="true" /><span>Sua evolução</span></div>
            <TrendingUp size={35} strokeWidth={1} className="text-cream/35" aria-hidden="true" />
            <p className="max-w-sm text-sm leading-relaxed text-cream/60">Acompanhe seu progresso pela constância nos treinos, pela técnica e pela confiança em cada movimento.</p>
          </div>
        ) : (
          <img src="/images/transformation.png" width="1280" height="853" loading="lazy" onError={() => setIsImageUnavailable(true)} alt="Comparativo de evolução física antes e depois" className="block h-auto w-full" />
        )}
      </div>
      <figcaption className="mt-4 flex flex-col justify-between gap-2 text-[11px] leading-relaxed text-cream/60 sm:flex-row">
        {!isImageUnavailable && <span>Comparativo de evolução física</span>}
        <span>Cada pessoa tem seu ritmo. Resultados individuais variam.</span>
      </figcaption>
    </figure>
  )
}
