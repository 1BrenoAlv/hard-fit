const highlights = [
  'Mais consciência',
  'Mais consistência',
  'Mais evolução',
  'Seu corpo. Seu processo.',
]

export default function HighlightsMarquee() {
  return (
    <div className="overflow-hidden bg-lime text-forest">
      <div className="highlights-track flex w-max motion-reduce:w-full">
        {[false, true].map(isCopy => (
          <ul
            key={String(isCopy)}
            aria-hidden={isCopy || undefined}
            className={`flex min-w-[100vw] shrink-0 items-center justify-around gap-x-8 px-4 py-4 text-xs font-bold tracking-[0.16em] uppercase sm:gap-x-12 sm:px-6 sm:text-sm ${isCopy ? 'motion-reduce:hidden' : 'motion-reduce:min-w-0 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:gap-y-2'}`}
          >
            {highlights.map(highlight => (
              <li
                key={highlight}
                className="flex items-center gap-8 whitespace-nowrap sm:gap-12"
              >
                {highlight}
                <span aria-hidden="true">✳</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
