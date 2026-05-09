export const apiUrl = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8787'

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
