import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/static'
import { defineConfig } from 'astro/config'
import astroI18next from 'astro-i18next'

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
  output: 'static',
  adapter: vercel({
    speedInsights: {
      enabled: true
    },
    webAnalytics: {
      enabled: true
    },
    imageService: true,
    devImageService: 'squoosh'
  }),
  site: baseUrl,
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
})
