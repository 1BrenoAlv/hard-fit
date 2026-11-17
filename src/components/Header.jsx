import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import Brand from './Brand'
import { navigationLinks } from '../content'

export default function Header({ onEnrollmentClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative z-30 border-b border-cream/10 bg-forest">
      <div className="page-container flex h-23 items-center justify-between gap-6">
        <Brand />
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-8 text-[13px] text-cream/75 lg:flex"
        >
          {navigationLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-lime"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          onClick={onEnrollmentClick}
          className="secondary-button hidden shrink-0 sm:inline-flex"
        >
          Falar com a HardFit <ArrowUpRight size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setIsMenuOpen(previous => !previous)}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          className="grid size-11 shrink-0 place-items-center text-lime lg:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navegação mobile"
          className="absolute inset-x-0 top-full border-b border-cream/15 bg-forest px-6 py-6 shadow-2xl lg:hidden"
        >
          {navigationLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block border-b border-cream/10 py-4 text-lg"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setIsMenuOpen(false)
              onEnrollmentClick()
            }}
            className="primary-button mt-6 w-full"
          >
            Falar com a HardFit <ArrowUpRight size={18} />
          </button>
        </nav>
      )}
    </header>
  )
}
