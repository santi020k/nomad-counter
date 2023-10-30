import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel/serverless'
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
      },
      filter: filterSitemapByDefaultLocale({ defaultLocale, base: baseUrl })
    })],
  output: 'server',
  adapter: vercel(),
  site: baseUrl,
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
})
