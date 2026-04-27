type ElementGuard<T extends Element> = (el: Element) => el is T

export const $ = <T extends Element = HTMLElement>(selector: string, guard?: ElementGuard<T>): T | null => {
  const el = document.querySelector(selector)

  if (!el) {
    return null
  }

  if (guard) {
    return guard(el) ? el : null
  }

  return el as T
}

export const $$ = <T extends Element = HTMLElement>(selector: string, guard?: ElementGuard<T>): T[] => {
  const elements = [...document.querySelectorAll(selector)]

  if (guard) {
    return elements.filter(guard)
  }

  return elements as T[]
}

export const formString = (data: FormData, key: string) => {
  const value = data.get(key)

  return typeof value === 'string' ? value : ''
}

export const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong.'
