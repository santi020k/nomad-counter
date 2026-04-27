import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const publicDir = path.join(root, 'apps/web/public')
const brandDir = path.join(root, 'assets/brand')
const mark = path.join(brandDir, 'logo-mark.svg')
const lightLogo = path.join(brandDir, 'logo-light.svg')
const darkLogo = path.join(brandDir, 'logo-dark.svg')

await fs.mkdir(publicDir, { recursive: true })
await fs.copyFile(mark, path.join(publicDir, 'favicon.svg'))
await fs.copyFile(lightLogo, path.join(publicDir, 'logo.svg'))
await fs.copyFile(darkLogo, path.join(publicDir, 'logo-dark.svg'))

const png = async (file, size) => sharp(mark).resize(size, size).png().toFile(path.join(publicDir, file))

const escapeXml = (unsafe) => {
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '"': return '&quot;'
      case "'": return '&apos;'
      default: return c
    }
  })
}

const generateOgImage = async (filename, title, subtitle) => {
  const safeTitle = escapeXml(title)
  const safeSubtitle = escapeXml(subtitle)
  
  return sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: '#f8fafc'
    }
  })
    .composite([
      { input: await sharp(lightLogo).resize(620).png().toBuffer(), left: 96, top: 96 },
      {
        input: Buffer.from(`<svg width="1008" height="240">
          <text x="0" y="64" font-family="Inter,Arial,sans-serif" font-size="52" font-weight="800" fill="#1F2937">${safeTitle}</text>
          <text x="0" y="128" font-family="Inter,Arial,sans-serif" font-size="32" fill="#6B7280">${safeSubtitle}</text>
        </svg>`),
        left: 96,
        top: 330
      }
    ])
    .png()
    .toFile(path.join(publicDir, filename))
}

await Promise.all([
  png('favicon-16.png', 16),
  png('favicon-32.png', 32),
  png('favicon-48.png', 48),
  png('apple-touch-icon.png', 180),
  png('android-chrome-192.png', 192),
  png('android-chrome-512.png', 512),
  sharp(mark).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.ico')),
  generateOgImage('og-image.png', 'Know your days before they count against you.', 'A private 183-day residency exposure tracker.'),
  generateOgImage('og-stats.png', 'Public Nomad Counter Statistics', 'Aggregate travel trends and platform health.'),
  generateOgImage('og-legal.png', 'Legal & Privacy Policy', 'How we handle your data and privacy.')
])

await fs.writeFile(path.join(publicDir, 'site.webmanifest'), `${JSON.stringify({
  name: 'Nomad Counter',
  short_name: 'Nomad',
  description: 'Private 183-day tax residency exposure tracker.',
  start_url: '/',
  display: 'standalone',
  background_color: '#f8fafc',
  theme_color: '#471aa0',
  icons: [
    { src: '/android-chrome-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/android-chrome-512.png', sizes: '512x512', type: 'image/png' }
  ]
}, null, 2)}\n`)
