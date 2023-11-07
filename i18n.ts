import { initReactI18next } from 'react-i18next'

import { getLocaleUrl } from 'astro-i18n-aut'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'

void i18next
  .use(resourcesToBackend(async (language: string, namespace: string) =>
    await import(`./public/locales/${language}/${namespace}.json`)))
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    ns: ['common', 'home'],
    partialBundledLanguages: true,
    supportedLngs: ['en', 'es']
  })

export { getLocale, getLocaleUrl } from 'astro-i18n-aut'
export * from 'i18next'

export const localizePath = (url: string, location?: string): string => getLocaleUrl(url, location ?? i18next?.language)

export default i18next
