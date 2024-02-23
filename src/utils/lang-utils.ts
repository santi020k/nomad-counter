import { getLocaleUrl } from 'astro-i18n-aut'
import i18next from 'i18next'

export { getLocale, getLocaleUrl } from 'astro-i18n-aut'
export * from 'i18next'
export default i18next

export const localizePath = (url: string, location?: string): string => getLocaleUrl(
  url,
  location ?? i18next?.language
)

export const toggleLanguage = ({ pathname, language }: { pathname: string, language: string }): string => (
  localizePath(
    pathname,
    language === 'en'
      ? 'es'
      : 'en'
  )
)
