import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/static'
import { defineConfig } from 'astro/config'
import { filterSitemapByDefaultLocale, i18n } from 'astro-i18n-aut/integration'

const defaultLocale = 'en'
const locales = {
  en: 'en',
  es: 'es'
}
const baseUrl = import.meta.env.DEV
  ? 'http://localhost:4321'
  : 'https://nomad.santi020k.me'

export default defineConfig({
  integrations: [
    tailwind(),
    react(),
    mdx(),
    i18n({
      locales,
      defaultLocale,
      exclude: [
        'pages/api/**/*',
        'pages/**/*.md',
        'pages/**/*.mdx'
      ]
    }),
    sitemap({
      i18n: {
        locales,
        defaultLocale
      },
      filter: filterSitemapByDefaultLocale({
        defaultLocale,
        base: baseUrl
      })
    })
  ],
  output: 'static',
  adapter: vercel({
    speedInsights: {
      enabled: true
    },
    webAnalytics: {
      enabled: true
    },
    imageService: true
  }),
  site: baseUrl,
  trailingSlash: 'always',
  build: {
    format: 'directory'
  },
  prefetch: true
})
