import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function Carousel({ label, slides }) {
  const trackReference = useRef(null)
  const trackId = useId()
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const track = trackReference.current
    function updateActiveSlide() {
      const slideWidth = track.clientWidth
      setActiveSlide(Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / slideWidth))))
    }
    const resizeObserver = new ResizeObserver(updateActiveSlide)
    resizeObserver.observe(track)
    track.addEventListener('scroll', updateActiveSlide, { passive: true })
    return () => {
      resizeObserver.disconnect()
      track.removeEventListener('scroll', updateActiveSlide)
    }
  }, [slides.length])

  function navigateToSlide(index) {
    const track = trackReference.current
    const nextSlide = Math.max(0, Math.min(slides.length - 1, index))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({ left: nextSlide * track.clientWidth, behavior: reducedMotion ? 'instant' : 'smooth' })
  }

  function handleKeyDown(event) {
    if (event.target !== event.currentTarget) return
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      navigateToSlide(activeSlide + (event.key === 'ArrowRight' ? 1 : -1))
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      navigateToSlide(event.key === 'Home' ? 0 : slides.length - 1)
    }
  }

  return (
    <section role="region" aria-roledescription="carrossel" aria-label={label}>
      <div id={trackId} ref={trackReference} onKeyDown={handleKeyDown} tabIndex={0} aria-label={`${label}. Use as setas do teclado para navegar.`} className="carousel-track flex snap-x snap-mandatory overflow-x-auto rounded-2xl border border-lime/20 focus-visible:outline-2 focus-visible:outline-lime">
        {slides.map((slide, index) => <div key={slide.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} de ${slides.length}: ${slide.label}`} className="flex w-full shrink-0 snap-start snap-always flex-col">{slide.content}</div>)}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex gap-2" aria-label="Selecionar slide">{slides.map((slide, index) => <button key={slide.id} type="button" aria-label={`Ir para ${slide.label}`} aria-controls={trackId} aria-current={activeSlide === index ? 'true' : undefined} onClick={() => navigateToSlide(index)} className="group flex min-h-11 min-w-9 items-center justify-center"><span className={`block h-1 rounded-full transition-all ${activeSlide === index ? 'w-9 bg-lime' : 'w-5 bg-cream/25 group-hover:bg-cream/60'}`} /></button>)}</div>
        <div className="flex items-center gap-3"><span className="mr-2 text-xs tabular-nums text-muted" aria-live="polite" aria-atomic="true">0{activeSlide + 1} / 0{slides.length}</span><button type="button" onClick={() => navigateToSlide(activeSlide - 1)} disabled={activeSlide === 0} aria-label="Slide anterior" aria-controls={trackId} className="carousel-arrow"><ArrowLeft size={19} /></button><button type="button" onClick={() => navigateToSlide(activeSlide + 1)} disabled={activeSlide === slides.length - 1} aria-label="Próximo slide" aria-controls={trackId} className="carousel-arrow"><ArrowRight size={19} /></button></div>
      </div>
    </section>
  )
}
