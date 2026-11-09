async function request(path, { method = 'GET', authorization, csrf, body, signal } = {}) {
  const headers = { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
  const isMultipart = body instanceof FormData

  if (authorization) headers.Authorization = authorization
  if (csrf) headers[csrf.headerName] = csrf.token
  if (body && !isMultipart) headers['Content-Type'] = 'application/json'

  let response
  try {
    response = await fetch(path, {
      method,
      headers,
      credentials: 'same-origin',
      body: isMultipart ? body : body ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Não foi possível conectar à API da HardFit.')
  }

  if (response.status === 401) throw new Error('Usuário ou senha inválidos. Entre novamente se necessário.')
  if (response.status === 403) throw new Error('A API recusou a operação. Entre novamente e tente de novo.')
  if (response.status === 400) throw new Error('Confira os campos preenchidos e tente novamente.')
  if (response.status === 404) throw new Error('O conteúdo não foi encontrado.')
  if (response.status === 413) throw new Error('Cada foto pode ter até 5 MB.')
  if (response.status === 415) throw new Error('Use uma imagem JPG, PNG ou WebP.')
  if (!response.ok) throw new Error('A API está indisponível. Tente novamente em instantes.')
  if (response.status === 204) return
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('A API da HardFit não respondeu com os dados esperados.')
  }
  return response.json()
}

export function loadSiteContent(signal) {
  return request('/api/site-content', { signal })
}

export function basicAuthorization(username, password) {
  const bytes = new TextEncoder().encode(`${username}:${password}`)
  return `Basic ${btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''))}`
}

export function loadCsrfToken(authorization) {
  return request('/api/admin/csrf', { authorization })
}

export async function saveAdminContent(path, method, authorization, body) {
  const csrf = await loadCsrfToken(authorization)
  return request(`/api/admin/${path}`, { method, authorization, csrf, body })
}

export async function uploadAdminImage(file, authorization) {
  if (file.size > 5 * 1024 * 1024) throw new Error('Cada foto pode ter até 5 MB.')
  const form = new FormData()
  form.append('file', file)
  const { url } = await saveAdminContent('images', 'POST', authorization, form)
  return url
}
