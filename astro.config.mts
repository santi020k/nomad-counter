import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel/serverless'
// @ts-expect-error This library has been in beta for a year and is not in current development
// but it is the best astro i18n library, so I must temporarily ignore ts errors
import astroI18next from 'astro-i18next'
import sitemap from '@astrojs/sitemap'

const defaultLocale = 'en'
const locales = {
  en: 'en-US', // the `defaultLocale` value must present in `locales` keys
  es: 'es-ES'
}
const baseUrl = 'https://nomad.santi020k.me'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), astroI18next(),
    sitemap({
      i18n: {
        locales,
        defaultLocale
      }
    })],
  output: 'server',
  adapter: vercel(),
  site: baseUrl,
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
})
