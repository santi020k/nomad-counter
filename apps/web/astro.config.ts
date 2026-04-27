import { defineConfig } from 'astro/config'
import robotsTxt from 'astro-robots-txt'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const site = 'https://nomad.santi020k.com'

export default defineConfig({
  site,
  integrations: [
    sitemap({
      serialize(item) {
        const isHome = item.url === site || item.url === `${site}/`

        return {
          ...item,
          changefreq: isHome ? ChangeFreqEnum.WEEKLY : ChangeFreqEnum.MONTHLY,
          priority: isHome ? 1 : 0.6
        }
      }
    }),
    robotsTxt()
  ],
  vite: {
    envDir: monorepoRoot,
    plugins: [tailwindcss()]
  },
  image: {}
})
