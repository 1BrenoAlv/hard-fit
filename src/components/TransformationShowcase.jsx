import { useState } from 'react'
import { ArrowRight, ImageOff } from 'lucide-react'

export default function TransformationShowcase() {
  const [isImageUnavailable, setIsImageUnavailable] = useState(false)

  return (
    <figure className="mt-11">
      <div className="overflow-hidden border border-forest/15 bg-forest">
        {isImageUnavailable ? (
          <div className="flex min-h-80 flex-col items-center justify-center gap-7 p-8 text-center text-cream sm:min-h-110">
            <div className="flex items-center gap-8 text-2xl font-semibold text-lime"><span>Antes</span><ArrowRight size={25} strokeWidth={1} aria-hidden="true" /><span>Depois</span></div>
            <ImageOff size={35} strokeWidth={1} className="text-cream/35" aria-hidden="true" />
            <p className="max-w-sm text-sm leading-relaxed text-cream/60">Espaço reservado para a imagem de transformação do HardFit Club.</p>
          </div>
        ) : (
          <img src="/images/transformation.png" width="1280" height="853" loading="lazy" onError={() => setIsImageUnavailable(true)} alt="Comparativo de antes e depois fornecido para a demonstração do HardFit Club" className="block h-auto w-full" />
        )}
      </div>
      <figcaption className="mt-4 flex flex-col justify-between gap-2 text-[11px] leading-relaxed text-cream/60 sm:flex-row">
        <span>{isImageUnavailable ? 'Comparativo ilustrativo do projeto.' : 'Imagem de transformação fornecida para este projeto.'}</span>
        <span>Cada pessoa tem seu ritmo. Resultados individuais variam.</span>
      </figcaption>
    </figure>
  )
}
