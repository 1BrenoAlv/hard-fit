const founders = [
  {
    name: 'Miguel Alves Ribeiro da Silva',
    role: 'Cofundador e Head de Negócios',
    image: '/images/miguel-alves.webp',
    imagePosition: 'object-[50%_36%]',
    bio: 'Miguel lidera a área de negócios da HardFit. Acredita que a musculação pode melhorar a saúde, fortalecer a autoestima e criar hábitos que fazem diferença na rotina. Essa visão orienta o desenvolvimento da mentoria.',
  },
  {
    name: 'Lucas Piro',
    role: 'Cofundador e personal trainer',
    image: '/images/lucas-piro.webp',
    imagePosition: 'object-[56%_52%]',
    bio: 'Lucas é personal trainer com pós-graduação em quatro áreas ligadas à saúde e à musculação. É responsável pelo desenvolvimento dos treinos e conteúdos da HardFit, com foco em ensinar os fundamentos do treino e como aplicá-los na prática.',
  },
]

export default function FoundersSection() {
  return (
    <section id="equipe" aria-labelledby="founders-title" className="border-b border-cream/10 py-16 md:py-24">
      <div className="page-container">
        <h2 id="founders-title" className="text-4xl leading-tight tracking-tight md:text-5xl">
          Quem está por trás da <em className="text-lime">HardFit</em>
        </h2>
        <div className="mt-9 grid gap-6 md:grid-cols-2">
          {founders.map(founder => (
            <article key={founder.name} className="overflow-hidden rounded-xl border border-cream/15 bg-forest-light">
              <img
                src={founder.image}
                alt={founder.name}
                width="900"
                height="1200"
                loading="lazy"
                decoding="async"
                className={`block aspect-[4/3] w-full bg-forest object-cover ${founder.imagePosition}`}
              />
              <div className="border-t border-lime/20 p-6 sm:p-8">
                <h3 className="text-2xl leading-tight font-bold tracking-tight">{founder.name}</h3>
                <p className="mt-2 text-sm font-semibold text-lime">{founder.role}</p>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">{founder.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
