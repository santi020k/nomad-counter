import i18next, { localizePath } from '@libs/i18n/i18n'

export const handleToggleLanguage = ({ pathname }: { pathname: string }): string => (
  localizePath(pathname, i18next.language === 'en' ? 'es' : 'en')
)

export const getCurrentPath = ({ pathname }: { pathname: string }): string => (
  localizePath(pathname, i18next.language)
)
