import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const bannersDir = path.join(root, 'assets/brand/banners')
const WIDTH = 1584
const HEIGHT = 396

const renderBanner1 = () => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <pattern id="grid1" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#1F2937" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid1)" />
  
  <g transform="translate(64, 140)">
    <!-- Logo Mark -->
    <rect width="116" height="116" rx="26" fill="#471AA0" />
    <rect x="32" y="32" width="20" height="20" rx="5" fill="#FFFFFF" fill-opacity="0.95" />
    <rect x="64" y="32" width="20" height="20" rx="5" fill="#FFFFFF" fill-opacity="0.6" />
    <rect x="32" y="64" width="20" height="20" rx="5" fill="#FFFFFF" fill-opacity="0.3" />
    <rect x="64" y="64" width="20" height="20" rx="5" fill="#EAB308" />
  </g>
  
  <!-- Wordmark -->
  <text x="210" y="222" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="72" fill="#F8FAFC" letter-spacing="-0.04em">Nomad<tspan fill="#B579E6" font-weight="600" letter-spacing="-0.02em">Counter</tspan></text>
  
  <!-- Subtitle -->
  <text x="215" y="270" font-family="Inter, Arial, sans-serif" font-weight="500" font-size="28" fill="#9CA3AF" letter-spacing="-0.01em">Private 183-day residency exposure tracker.</text>
</svg>
`)

const renderBanner2 = () => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(71,26,160,0.06)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#F8FAFC" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid2)" />
  
  <g transform="translate(${WIDTH / 2 - 270}, 140)">
    <!-- Logo Mark -->
    <rect width="116" height="116" rx="26" fill="#471AA0" />
    <rect x="32" y="32" width="20" height="20" rx="5" fill="#FFFFFF" fill-opacity="0.95" />
    <rect x="64" y="32" width="20" height="20" rx="5" fill="#FFFFFF" fill-opacity="0.6" />
    <rect x="32" y="64" width="20" height="20" rx="5" fill="#FFFFFF" fill-opacity="0.3" />
    <rect x="64" y="64" width="20" height="20" rx="5" fill="#EAB308" />
  </g>
  
  <!-- Wordmark -->
  <text x="${WIDTH / 2 - 120}" y="222" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="72" fill="#1F2937" letter-spacing="-0.04em">Nomad<tspan fill="#471AA0" font-weight="600" letter-spacing="-0.02em">Counter</tspan></text>
</svg>
`)

const renderBanner3 = () => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4C1D95" />
      <stop offset="50%" stop-color="#471AA0" />
      <stop offset="100%" stop-color="#804BC4" />
    </linearGradient>
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.15)"/>
    </pattern>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad1)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)" />
  
  <g transform="translate(${WIDTH / 2 - 320}, 100)">
    <!-- Logo Mark - Glassmorphic -->
    <rect width="116" height="116" rx="26" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
    <rect x="32" y="32" width="20" height="20" rx="5" fill="#FFFFFF" fill-opacity="0.95" />
    <rect x="64" y="32" width="20" height="20" rx="5" fill="#FFFFFF" fill-opacity="0.6" />
    <rect x="32" y="64" width="20" height="20" rx="5" fill="#FFFFFF" fill-opacity="0.3" />
    <rect x="64" y="64" width="20" height="20" rx="5" fill="#EAB308" />
  </g>
  
  <!-- Wordmark -->
  <text x="${WIDTH / 2 - 170}" y="182" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="72" fill="#FFFFFF" letter-spacing="-0.04em">Nomad Counter</text>
  <text x="${WIDTH / 2 - 165}" y="230" font-family="Inter, Arial, sans-serif" font-weight="500" font-size="28" fill="rgba(255,255,255,0.85)" letter-spacing="-0.01em">Know your days before they count against you.</text>
</svg>
`)

const renderBanner4 = () => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#1F2937" />
  
  <!-- Abstract geometric shapes -->
  <circle cx="1400" cy="50" r="300" fill="#B579E6" opacity="0.1" filter="blur(60px)"/>
  <circle cx="200" cy="350" r="250" fill="#471AA0" opacity="0.15" filter="blur(50px)"/>

  <g transform="translate(${WIDTH - 200}, ${HEIGHT / 2 - 60})">
    <rect width="120" height="120" rx="30" fill="none" stroke="#804BC4" stroke-width="4" stroke-dasharray="12 12" />
    <rect width="80" height="80" x="20" y="20" rx="20" fill="#804BC4" opacity="0.2" />
    <rect x="38" y="38" width="16" height="16" rx="4" fill="#FFFFFF" fill-opacity="0.95" />
    <rect x="66" y="38" width="16" height="16" rx="4" fill="#FFFFFF" fill-opacity="0.6" />
    <rect x="38" y="66" width="16" height="16" rx="4" fill="#FFFFFF" fill-opacity="0.3" />
    <rect x="66" y="66" width="16" height="16" rx="4" fill="#EAB308" />
  </g>
  
  <!-- Wordmark -->
  <text x="80" y="200" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="64" fill="#F8FAFC" letter-spacing="-0.04em">NOMAD COUNTER</text>
  <text x="82" y="246" font-family="Inter, Arial, sans-serif" font-weight="500" font-size="28" fill="#804BC4" letter-spacing="0.1em">CLEAR RESIDENCY RISK TRACKING.</text>
</svg>
`)

const renderBanner5 = () => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#F8FAFC" />
  
  <!-- Big fully visible icon on the right -->
  <g transform="translate(1100, 48) scale(2.4)">
    <rect width="128" height="128" rx="28" fill="#471AA0" />
    <rect x="36" y="36" width="22" height="22" rx="6" fill="#FFFFFF" fill-opacity="0.95" />
    <rect x="70" y="36" width="22" height="22" rx="6" fill="#FFFFFF" fill-opacity="0.6" />
    <rect x="36" y="70" width="22" height="22" rx="6" fill="#FFFFFF" fill-opacity="0.3" />
    <rect x="70" y="70" width="22" height="22" rx="6" fill="#EAB308" />
  </g>

  <!-- Wordmark -->
  <text x="140" y="222" font-family="Inter, Arial, sans-serif" font-weight="800" font-size="72" fill="#1F2937" letter-spacing="-0.04em">Nomad<tspan fill="#471AA0" font-weight="600" letter-spacing="-0.02em">Counter</tspan></text>
</svg>
`)

const writeWebp = async (filename, sourceBuffer) => {
  await sharp(sourceBuffer)
    .resize(WIDTH, HEIGHT)
    .webp({ quality: 92, effort: 4 })
    .toFile(path.join(bannersDir, filename))
}

const main = async () => {
  await mkdir(bannersDir, { recursive: true })

  await writeWebp('banner-1.webp', renderBanner1())

  await writeWebp('banner-2.webp', renderBanner2())

  await writeWebp('banner-3.webp', renderBanner3())

  await writeWebp('banner-4.webp', renderBanner4())

  await writeWebp('banner-5.webp', renderBanner5())

  console.log('Successfully generated 5 new brand banners in assets/brand/banners.')
}

main().catch(console.error)
