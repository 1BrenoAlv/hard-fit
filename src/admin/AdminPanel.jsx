import { useState } from 'react'
import { ArrowLeft, Image, Link2, LockKeyhole, LogOut, Plus, Save, Trash2 } from 'lucide-react'
import { basicAuthorization, loadCsrfToken, loadSiteContent, saveAdminContent, uploadAdminImage } from '../siteApi'

const imageFields = [
  ['heroImageUrl', 'Banner principal'],
  ['fatLossImageUrl', 'Carrossel · Redução de gordura'],
  ['strengthImageUrl', 'Carrossel · Ganho de força'],
  ['consistencyImageUrl', 'Carrossel · Rotina de treino'],
]

const emptyEvolution = { title: '', beforeImageUrl: '', afterImageUrl: '' }
const cardClass = 'rounded-xl border border-cream/15 bg-forest-light p-5 sm:p-7'
const inputClass = 'mt-2 w-full rounded-lg border border-cream/20 bg-forest px-3 py-3 text-base text-cream placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-lime'

function ImageField({ name, label, imageUrl, required = false, allowReset = false }) {
  return (
    <div>
      <label className="block min-w-0 text-sm text-cream">
        {label}
        <input
          className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-lime file:px-3 file:py-1 file:text-xs file:font-bold file:text-forest`}
          name={name}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={required}
        />
      </label>
      {imageUrl && (
        <div className="mt-2 flex items-center gap-3">
          <img src={imageUrl} alt="" className="h-14 w-20 rounded border border-cream/15 bg-forest object-contain" />
          {allowReset && <label className="flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" name={`reset-${name}`} className="accent-lime" /> Restaurar imagem padrão
          </label>}
        </div>
      )}
    </div>
  )
}

async function resolveImage(formData, name, currentUrl, authorization) {
  const file = formData.get(name)
  if (file?.size > 0) return uploadAdminImage(file, authorization)
  if (formData.has(`reset-${name}`)) return null
  return currentUrl || null
}

function UrlField({ name, label, value, onChange }) {
  return (
    <label className="block min-w-0 text-sm text-cream">
      {label}
      <input
        className={inputClass}
        name={name}
        type="url"
        pattern="https://.+"
        maxLength={2048}
        placeholder="https://"
        value={value ?? ''}
        onChange={event => onChange(name, event.target.value)}
      />
    </label>
  )
}

export default function AdminPanel() {
  const [authorization, setAuthorization] = useState('')
  const [settings, setSettings] = useState(null)
  const [evolutions, setEvolutions] = useState([])
  const [draft, setDraft] = useState(emptyEvolution)
  const [editingId, setEditingId] = useState(null)
  const [notice, setNotice] = useState(null)
  const [isBusy, setIsBusy] = useState(false)

  async function runAction(action, successMessage) {
    setIsBusy(true)
    setNotice(null)
    try {
      await action()
      if (successMessage) setNotice({ text: successMessage, error: false })
    } catch (error) {
      setNotice({ text: error.message, error: true })
    } finally {
      setIsBusy(false)
    }
  }

  function signIn(event) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const credentials = basicAuthorization(fields.get('username').trim(), fields.get('password'))

    runAction(async () => {
      await loadCsrfToken(credentials)
      const content = await loadSiteContent()
      form.reset()
      setSettings(content.settings)
      setEvolutions(content.evolutions)
      setAuthorization(credentials)
    })
  }

  function signOut() {
    setAuthorization('')
    setSettings(null)
    setEvolutions([])
    setNotice(null)
    resetDraft()
  }

  function updateSetting(name, value) {
    setSettings(current => ({ ...current, [name]: value }))
  }

  function updateDraft(name, value) {
    setDraft(current => ({ ...current, [name]: value }))
  }

  function resetDraft() {
    setEditingId(null)
    setDraft(emptyEvolution)
  }

  function submitSettings(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    runAction(async () => {
      const values = { hotmartUrl: settings.hotmartUrl?.trim() || null }
      for (const [name] of imageFields) {
        values[name] = await resolveImage(formData, name, settings[name], authorization)
      }
      const saved = await saveAdminContent('settings', 'PUT', authorization, values)
      form.reset()
      setSettings(saved)
    }, 'Configurações publicadas.')
  }

  function submitEvolution(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    runAction(async () => {
      const path = editingId ? `evolutions/${editingId}` : 'evolutions'
      const values = {
        title: draft.title.trim(),
        beforeImageUrl: await resolveImage(formData, 'beforeImageUrl', draft.beforeImageUrl, authorization),
        afterImageUrl: await resolveImage(formData, 'afterImageUrl', draft.afterImageUrl, authorization),
      }
      const saved = await saveAdminContent(path, editingId ? 'PUT' : 'POST', authorization, values)
      setEvolutions(current => editingId
        ? current.map(evolution => evolution.id === editingId ? saved : evolution)
        : [saved, ...current])
      form.reset()
      resetDraft()
    }, editingId ? 'Comparativo atualizado.' : 'Comparativo publicado.')
  }

  function deleteEvolution(evolution) {
    if (!window.confirm(`Remover o comparativo “${evolution.title}” da página inicial?`)) return
    runAction(async () => {
      await saveAdminContent(`evolutions/${evolution.id}`, 'DELETE', authorization)
      setEvolutions(current => current.filter(item => item.id !== evolution.id))
      if (editingId === evolution.id) resetDraft()
    }, 'Comparativo removido.')
  }

  return (
    <>
      <header className="border-b border-cream/15 bg-forest">
        <div className="page-container flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
          <a href="/" aria-label="Voltar para a HardFit" className="flex items-center gap-2 text-sm font-bold text-lime">
            <ArrowLeft size={17} aria-hidden="true" /> HardFit Club
          </a>
          {authorization && <button type="button" disabled={isBusy} onClick={signOut} className="secondary-button min-h-11 px-4 py-2">
            Sair <LogOut size={16} aria-hidden="true" />
          </button>}
        </div>
      </header>

      <main className={authorization ? 'page-container py-10 sm:py-14' : 'page-container flex min-h-[75vh] items-center justify-center py-12'}>
        {!authorization ? (
          <div className={`${cardClass} w-full max-w-md`}>
            <span className="inline-flex rounded-lg bg-lime/10 p-3 text-lime"><LockKeyhole size={22} aria-hidden="true" /></span>
            <h1 className="mt-5 text-3xl tracking-tight">Painel administrativo</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">Entre com sua conta administrativa da HardFit.</p>
            <form onSubmit={signIn} className="mt-6">
              <fieldset disabled={isBusy} className="space-y-4">
                <label className="block text-sm">Usuário
                  <input name="username" autoComplete="username" className={inputClass} required defaultValue="admin" />
                </label>
                <label className="block text-sm">Senha
                  <input name="password" type="password" autoComplete="current-password" className={inputClass} required />
                </label>
                {notice && <p role="alert" className="text-sm text-red-300">{notice.text}</p>}
                <button type="submit" className="primary-button w-full disabled:opacity-60">{isBusy ? 'Entrando…' : 'Entrar'}</button>
              </fieldset>
            </form>
          </div>
        ) : (
          <>
            <p className="section-label text-lime">Administração do site</p>
            <h1 className="mt-3 text-4xl tracking-tight sm:text-5xl">Painel HardFit</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">Gerencie o conteúdo exibido na página inicial.</p>
            <div aria-live="polite" className="sticky top-3 z-10 mt-4">
              {notice && <p className={`rounded-lg border bg-forest px-4 py-3 text-sm ${notice.error ? 'border-red-400/50 text-red-300' : 'border-lime/35 text-lime'}`}>{notice.text}</p>}
            </div>

            <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
              <section className={cardClass}>
                <h2 className="flex items-center gap-3 text-xl"><Link2 size={21} className="text-lime" aria-hidden="true" /> Links e imagens</h2>
                <p className="mt-2 text-sm text-muted">Selecione fotos JPG, PNG ou WebP do seu dispositivo, com até 5 MB por arquivo.</p>
                <form onSubmit={submitSettings} encType="multipart/form-data" className="mt-6">
                  <fieldset disabled={isBusy} className="space-y-4">
                    <UrlField name="hotmartUrl" label="Link da Hotmart" value={settings.hotmartUrl} onChange={updateSetting} />
                    {imageFields.map(([name, label]) => <ImageField key={name} name={name} label={label} imageUrl={settings[name]} allowReset />)}
                    <button type="submit" className="primary-button mt-2 w-full disabled:opacity-60">Salvar configurações <Save size={17} aria-hidden="true" /></button>
                  </fieldset>
                </form>
              </section>

              <section className={cardClass}>
                <h2 className="flex items-center gap-3 text-xl"><Image size={21} className="text-lime" aria-hidden="true" /> Antes e depois</h2>
                <p className="mt-2 text-sm text-muted">Os comparativos publicados aparecem na seção de evolução do site.</p>
                <form key={editingId ?? 'new'} onSubmit={submitEvolution} encType="multipart/form-data" className="mt-6">
                  <fieldset disabled={isBusy} className="space-y-4">
                    <label className="block text-sm">Título do comparativo
                      <input name="title" maxLength={120} className={inputClass} value={draft.title} onChange={event => updateDraft('title', event.target.value)} required />
                    </label>
                    <ImageField name="beforeImageUrl" label="Foto de antes" imageUrl={draft.beforeImageUrl} required={!draft.beforeImageUrl} />
                    <ImageField name="afterImageUrl" label="Foto de depois" imageUrl={draft.afterImageUrl} required={!draft.afterImageUrl} />
                    <div className="flex flex-wrap gap-3">
                      <button type="submit" className="primary-button disabled:opacity-60">
                        {editingId ? 'Salvar comparativo' : 'Publicar comparativo'} <Plus size={17} aria-hidden="true" />
                      </button>
                      {editingId && <button type="button" onClick={resetDraft} className="secondary-button">Cancelar</button>}
                    </div>
                  </fieldset>
                </form>

                <h3 className="mt-8 border-t border-cream/15 pt-5 text-sm font-bold">Publicados ({evolutions.length})</h3>
                {evolutions.length === 0 ? <p className="mt-3 text-sm text-muted">Nenhum comparativo publicado.</p> : (
                  <ul className="mt-3 space-y-2">
                    {evolutions.map(evolution => (
                      <li key={evolution.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-cream/10 px-3 py-2">
                        <span className="min-w-0 flex-1 text-sm break-words">{evolution.title}</span>
                        <div className="flex items-center gap-2">
                          <button type="button" disabled={isBusy} className="min-h-11 px-2 text-sm text-lime" onClick={() => {
                            setEditingId(evolution.id)
                            setDraft({ title: evolution.title, beforeImageUrl: evolution.beforeImageUrl, afterImageUrl: evolution.afterImageUrl })
                          }}>Editar</button>
                          <button type="button" disabled={isBusy} className="grid size-11 place-items-center text-red-300" aria-label={`Remover ${evolution.title}`} onClick={() => deleteEvolution(evolution)}><Trash2 size={17} aria-hidden="true" /></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </>
  )
}
