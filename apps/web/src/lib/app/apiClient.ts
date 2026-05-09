const productionApiUrl = 'https://api.nomad.santi020k.com'
const localApiUrl = 'http://localhost:8787'

const isLocalApiUrl = (value: string): boolean => {
  try {
    const { hostname } = new URL(value)

    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
  } catch {
    return false
  }
}

const configuredApiUrl = import.meta.env.PUBLIC_API_URL

const getApiUrl = (): string => {
  if (import.meta.env.DEV) {
    return configuredApiUrl ?? localApiUrl
  }

  if (configuredApiUrl && !isLocalApiUrl(configuredApiUrl)) {
    return configuredApiUrl
  }

  return productionApiUrl
}

const apiUrl = getApiUrl()

export const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const headers = new Headers(init?.headers)

  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${apiUrl}${path}`, {
    credentials: 'include',
    ...init,
    headers
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Request failed.' })) as { error?: string }

    throw new Error(body.error ?? 'Request failed.')
  }

  return response.json() as Promise<T>
}
