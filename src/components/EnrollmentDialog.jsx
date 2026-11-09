import { useEffect, useRef } from 'react'
import { ArrowUpRight, Camera, MessageCircle, ShoppingBag, X } from 'lucide-react'
import { mentorshipLinks } from '../mentorshipLinks'

const enrollmentOptions = [
  { label: 'Falar pelo WhatsApp', href: mentorshipLinks.whatsapp, icon: MessageCircle },
  { label: 'Falar pelo Instagram', href: mentorshipLinks.instagram, icon: Camera },
  { label: 'Continuar para a Hotmart', href: mentorshipLinks.checkout, icon: ShoppingBag },
].filter(option => option.href)

export default function EnrollmentDialog({ isOpen, onClose }) {
  const dialogReference = useRef(null)

  useEffect(() => {
    const dialog = dialogReference.current
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <dialog
      ref={dialogReference}
      onClose={onClose}
      onClick={event => { if (event.target === dialogReference.current) onClose() }}
      aria-labelledby="enrollment-title"
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl border border-cream/20 bg-forest p-7 text-cream shadow-2xl sm:p-10"
    >
      <button type="button" onClick={onClose} aria-label="Fechar opções de contato" className="absolute top-3 right-3 grid size-11 place-items-center rounded-lg hover:bg-white/10"><X size={20} aria-hidden="true" /></button>
      <p className="section-label mt-5 text-lime">Mentoria HardFit</p>
      <h2 id="enrollment-title" className="mt-5 text-3xl leading-tight sm:text-4xl">Como você quer começar?</h2>
      {enrollmentOptions.length > 0 ? (
        <>
          <p className="mt-4 text-sm leading-relaxed text-muted">Fale com a equipe para tirar dúvidas. A compra é feita pela Hotmart.</p>
          <div className="mt-7 grid gap-3">
            {enrollmentOptions.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} className={href === mentorshipLinks.checkout ? 'primary-button' : 'secondary-button'}>
                <Icon size={18} className="shrink-0" aria-hidden="true" />
                {label}
                <ArrowUpRight size={16} className="shrink-0" aria-hidden="true" />
              </a>
            ))}
          </div>
          {!mentorshipLinks.checkout && <p className="mt-5 text-sm text-muted">As inscrições pela Hotmart ainda não estão abertas.</p>}
        </>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-muted">A mentoria está em preparação. Os canais oficiais de contato e o link de inscrição serão divulgados aqui.</p>
      )}
    </dialog>
  )
}
