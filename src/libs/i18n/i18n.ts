/**
 * If this library is not updated over time,
 * this pattern reduces coupling and makes it easier to change in the future.
 */
import { localizePath } from 'astro-i18next'
import { HeadHrefLangs } from 'astro-i18next/components'
import i18next from 'i18next'

export * from 'i18next'
export default i18next
export { HeadHrefLangs, localizePath }
