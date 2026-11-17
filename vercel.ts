const apiUrl = process.env.HARDFIT_API_URL?.trim()

if (!apiUrl && process.env.VERCEL_ENV === 'production') {
  throw new Error(
    'Configure HARDFIT_API_URL com a URL pública do serviço no Render.',
  )
}

const apiOrigin = apiUrl ? new URL(apiUrl) : null

if (
  apiOrigin &&
  (apiOrigin.protocol !== 'https:' ||
    apiOrigin.username ||
    apiOrigin.password ||
    apiOrigin.pathname !== '/' ||
    apiOrigin.search ||
    apiOrigin.hash)
) {
  throw new Error(
    'HARDFIT_API_URL deve ser uma URL HTTPS de origem, sem credenciais, caminho ou parâmetros.',
  )
}

export const config = {
  rewrites: apiOrigin
    ? [
        {
          source: '/api/contact-requests',
          destination: `${apiOrigin.origin}/api/contact-requests`,
        },
      ]
    : [],
}
