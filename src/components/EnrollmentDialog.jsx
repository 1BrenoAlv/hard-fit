import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, X } from 'lucide-react'

export default function EnrollmentDialog({ isOpen, onClose }) {
  const dialogReference = useRef(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    const dialog = dialogReference.current
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
    if (!isOpen) setIsSubmitted(false)
  }, [isOpen])

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setFirstName(String(formData.get('name')).trim().split(' ')[0])
    setIsSubmitted(true)
  }

  return (
    <dialog ref={dialogReference} onCancel={onClose} onClose={onClose} onClick={event => { if (event.target === dialogReference.current) onClose() }} aria-labelledby="enrollment-title" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto border border-forest/15 bg-cream p-7 text-forest shadow-2xl sm:p-10">
      <button onClick={onClose} aria-label="Fechar formulário" className="absolute top-4 right-4 p-2"><X size={20} /></button>
      {isSubmitted ? (
        <div className="py-7 text-center" role="status">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-forest text-lime"><Check size={26} /></div>
          <h2 id="enrollment-title" className="text-3xl">Primeiro passo dado, {firstName}.</h2>
          <p className="mt-4 text-base leading-relaxed text-forest/70">Você concluiu a simulação de interesse no HardFit Club. Nenhum dado foi enviado ou armazenado e nenhuma cobrança foi realizada.</p>
          <button onClick={onClose} className="primary-button mt-8 w-full border-forest bg-forest text-cream hover:border-forest hover:bg-forest-light">Voltar para o clube <ArrowUpRight size={18} /></button>
        </div>
      ) : (
        <>
          <span className="section-label mt-4 text-forest/65">O seu próximo capítulo</span>
          <h2 id="enrollment-title" className="mt-5 text-4xl leading-tight">Toda evolução tem um <em>começo.</em></h2>
          <p className="mt-4 text-sm leading-relaxed text-forest/65">Conheça o formulário de interesse do HardFit Club.</p>
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="block text-sm">Seu nome<input name="name" autoComplete="name" placeholder="Como podemos chamar você?" required minLength={2} maxLength={100} pattern=".*\S.*" className="field" /></label>
            <label className="block text-sm">Seu e-mail<input name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required maxLength={254} className="field" /></label>
            <label className="block text-sm">Seu momento no treino<select name="experience" required defaultValue="" className="field"><option value="" disabled>Selecione uma opção</option><option value="beginner">Vou começar agora</option><option value="returning">Estou voltando a treinar</option><option value="experienced">Já treino e quero evoluir</option></select></label>
            <p className="border-l-2 border-forest/25 pl-3 text-xs leading-relaxed text-forest/65">Formulário demonstrativo do projeto de extensão. Seus dados não são enviados nem armazenados.</p>
            <button type="submit" className="primary-button w-full border-forest bg-forest text-cream hover:border-forest hover:bg-forest-light">Simular meu interesse <ArrowUpRight size={18} /></button>
          </form>
        </>
      )}
    </dialog>
  )
}
