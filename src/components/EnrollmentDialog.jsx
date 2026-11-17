import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { mentorshipLinks } from '../mentorshipLinks'

const contactOptions = [
  { label: 'WhatsApp', href: mentorshipLinks.whatsapp },
  { label: 'Instagram', href: mentorshipLinks.instagram },
].filter(option => option.href)

const fieldClass =
  'w-full rounded-lg border border-cream/25 bg-forest-light px-3 py-2.5 text-base text-cream focus-visible:outline-2 focus-visible:outline-lime'

export default function EnrollmentDialog({ isOpen, onClose }) {
  const dialogReference = useRef(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    const dialog = dialogReference.current
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  async function submitContact(event) {
    event.preventDefault()
    if (status === 'sending') return

    const form = event.currentTarget
    const fields = new FormData(form)
    const name = fields.get('name').trim()
    const email = fields.get('email').trim()
    const message = fields.get('message').trim()

    if (!name) {
      setError('Preencha seu nome.')
      form.elements.namedItem('name').focus()
      return
    }

    setError('')
    setStatus('sending')

    try {
      const response = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      if (response.status !== 201) {
        throw new Error(
          response.status === 400
            ? 'Confira os dados do formulário e tente novamente.'
            : 'Não foi possível enviar seu pedido. Tente novamente em instantes.',
        )
      }

      form.reset()
      setStatus('sent')
    } catch (error) {
      setError(
        error instanceof TypeError
          ? 'Não foi possível conectar à HardFit. Tente novamente em instantes.'
          : error.message,
      )
      setStatus('idle')
    }
  }

  return (
    <dialog
      ref={dialogReference}
      onClose={onClose}
      aria-labelledby="enrollment-title"
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl border border-cream/20 bg-forest p-6 text-cream shadow-2xl sm:p-9"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar formulário de contato"
        className="absolute top-3 right-3 grid size-11 place-items-center rounded-lg hover:bg-white/10"
      >
        <X size={20} aria-hidden="true" />
      </button>
      <p className="section-label pr-10 text-lime">Mentoria HardFit</p>
      <h2
        id="enrollment-title"
        className="mt-4 text-3xl leading-tight sm:text-4xl"
      >
        Quer saber mais?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Deixe seu e-mail para a equipe HardFit falar com você sobre a mentoria.
      </p>
      <div
        role="status"
        className={
          status === 'sent'
            ? 'mt-6 rounded-lg border border-lime/30 bg-lime/5 p-4 text-sm text-lime'
            : 'sr-only'
        }
      >
        {status === 'sent'
          ? 'Pedido recebido! A equipe HardFit pode entrar em contato pelo e-mail informado.'
          : ''}
      </div>
      {status === 'sent' ? (
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="secondary-button mt-5"
        >
          Enviar outro pedido
        </button>
      ) : (
        <form
          method="post"
          onSubmit={submitContact}
          className="mt-6 grid gap-4"
        >
          <fieldset
            disabled={status === 'sending'}
            className="grid min-w-0 gap-4"
          >
            <label className="grid gap-1.5 text-sm">
              Nome
              <input
                name="name"
                autoComplete="name"
                maxLength={120}
                required
                className={fieldClass}
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              E-mail
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                className={fieldClass}
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span>
                O que você quer saber?{' '}
                <span className="text-muted">(opcional)</span>
              </span>
              <textarea
                name="message"
                rows={3}
                maxLength={1000}
                className={fieldClass}
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-red-300">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="primary-button w-full disabled:opacity-60"
            >
              {status === 'sending' ? 'Enviando…' : 'Enviar pedido de contato'}
            </button>
          </fieldset>
        </form>
      )}
      {contactOptions.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-cream/15 pt-4 text-sm">
          {contactOptions.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="inline-flex items-center gap-1.5 text-muted underline-offset-4 hover:text-lime hover:underline"
            >
              {label}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
    </dialog>
  )
}
