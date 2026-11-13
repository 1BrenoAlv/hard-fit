import { useState } from 'react'
import { ArrowRight, TrendingUp } from 'lucide-react'

export default function TransformationShowcase() {
  const [isImageUnavailable, setIsImageUnavailable] = useState(false)

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
          <img src="/images/transformation.webp" width="1280" height="853" loading="lazy" onError={() => setIsImageUnavailable(true)} alt="Comparativo de evolução física, com a foto de antes à esquerda e a de depois à direita" className="block h-auto w-full" />
        )}
      </div>
      <figcaption className="mt-4 flex flex-col justify-between gap-2 text-[11px] leading-relaxed text-cream/60 sm:flex-row">
        {!isImageUnavailable && <span>Comparativo de evolução física</span>}
        <span>Cada pessoa tem seu ritmo. Resultados individuais variam.</span>
      </figcaption>
    </figure>
  )
}
