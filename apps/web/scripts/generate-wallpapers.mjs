import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const wallpapersDir = path.join(root, 'assets/brand/wallpapers')

const renderDesktop1 = () => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3840 2160">
  <rect width="3840" height="2160" fill="#1F2937" />
  
  <g transform="translate(1820, 980)">
    <!-- Logo Mark -->
    <rect width="200" height="200" rx="46" fill="#1F2937" stroke="#471AA0" stroke-width="4" />
    <rect x="56" y="56" width="34" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.95" />
    <rect x="110" y="56" width="34" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.6" />
    <rect x="56" y="110" width="34" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.3" />
    <rect x="110" y="110" width="34" height="34" rx="8" fill="#EAB308" />
  </g>
</svg>
`)

const renderMobile1 = () => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1170 2532">
  <rect width="1170" height="2532" fill="#1F2937" />
  <g transform="translate(485, 1166)">
    <!-- Logo Mark -->
    <rect width="200" height="200" rx="46" fill="#1F2937" stroke="#471AA0" stroke-width="4" />
    <rect x="56" y="56" width="34" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.95" />
    <rect x="110" y="56" width="34" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.6" />
    <rect x="56" y="110" width="34" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.3" />
    <rect x="110" y="110" width="34" height="34" rx="8" fill="#EAB308" />
  </g>
</svg>
`)

const renderDesktop2 = () => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3840 2160">
  <defs>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4C1D95" />
      <stop offset="50%" stop-color="#471AA0" />
      <stop offset="100%" stop-color="#804BC4" />
    </linearGradient>
    <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
      <path d="M 120 0 L 0 0 0 120" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"/>
    </pattern>
  </defs>
  <rect width="3840" height="2160" fill="url(#grad2)" />
  <rect width="3840" height="2160" fill="url(#grid)" />
  
  <g transform="translate(1820, 980)">
    <!-- Logo Mark -->
    <rect width="200" height="200" rx="46" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="4" />
    <rect x="56" y="56" width="34" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.95" />
    <rect x="110" y="56" width="34" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.6" />
    <rect x="56" y="110" width="34" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.3" />
    <rect x="110" y="110" width="34" height="34" rx="8" fill="#EAB308" />
  </g>
</svg>
`)

const renderMobile2 = () => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1170 2532">
  <defs>
    <linearGradient id="grad2m" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4C1D95" />
      <stop offset="50%" stop-color="#471AA0" />
      <stop offset="100%" stop-color="#804BC4" />
    </linearGradient>
    <pattern id="gridm" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"/>
    </pattern>
  </defs>
  <rect width="1170" height="2532" fill="url(#grad2m)" />
  <rect width="1170" height="2532" fill="url(#gridm)" />
  
  <g transform="translate(485, 1166)">
    <!-- Logo Mark -->
    <rect width="200" height="200" rx="46" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="4" />
    <rect x="56" y="56" width="34" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.95" />
    <rect x="110" y="56" width="34" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.6" />
    <rect x="56" y="110" width="34" height="34" rx="8" fill="#FFFFFF" fill-opacity="0.3" />
    <rect x="110" y="110" width="34" height="34" rx="8" fill="#EAB308" />
  </g>
</svg>
`)

const renderDesktop3 = () => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3840 2160">
  <defs>
    <pattern id="grid3" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(71,26,160,0.07)" stroke-width="2"/>
    </pattern>
  </defs>
  <rect width="3840" height="2160" fill="#F8FAFC" />
  <rect width="3840" height="2160" fill="url(#grid3)" />
  
  <g transform="translate(2000, 300) scale(10)">
    <rect width="200" height="200" rx="46" fill="none" stroke="#471AA0" stroke-width="1" stroke-dasharray="8 8" opacity="0.3"/>
    <rect x="56" y="56" width="34" height="34" rx="8" fill="#471AA0" fill-opacity="0.5" />
    <rect x="110" y="56" width="34" height="34" rx="8" fill="#471AA0" fill-opacity="0.3" />
    <rect x="56" y="110" width="34" height="34" rx="8" fill="#471AA0" fill-opacity="0.1" />
    <rect x="110" y="110" width="34" height="34" rx="8" fill="#EAB308" fill-opacity="0.8" />
  </g>
</svg>
`)

const renderMobile3 = () => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1170 2532">
  <defs>
    <pattern id="grid3m" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(71,26,160,0.07)" stroke-width="2"/>
    </pattern>
  </defs>
  <rect width="1170" height="2532" fill="#F8FAFC" />
  <rect width="1170" height="2532" fill="url(#grid3m)" />
  
  <g transform="translate(-500, 500) scale(8)">
    <rect width="200" height="200" rx="46" fill="none" stroke="#471AA0" stroke-width="1" stroke-dasharray="8 8" opacity="0.3"/>
    <rect x="56" y="56" width="34" height="34" rx="8" fill="#471AA0" fill-opacity="0.5" />
    <rect x="110" y="56" width="34" height="34" rx="8" fill="#471AA0" fill-opacity="0.3" />
    <rect x="56" y="110" width="34" height="34" rx="8" fill="#471AA0" fill-opacity="0.1" />
    <rect x="110" y="110" width="34" height="34" rx="8" fill="#EAB308" fill-opacity="0.8" />
  </g>
</svg>
`)

const writeWebp = async (filename, sourceBuffer, width, height) => {
  await sharp(sourceBuffer)
    .resize(width, height)
    .webp({ quality: 92, effort: 4 })
    .toFile(path.join(wallpapersDir, filename))
}

const main = async () => {
  await mkdir(wallpapersDir, { recursive: true })

  await writeWebp('wallpaper-1-desktop.webp', renderDesktop1(), 3840, 2160)

  await writeWebp('wallpaper-1-mobile.webp', renderMobile1(), 1170, 2532)

  await writeWebp('wallpaper-2-desktop.webp', renderDesktop2(), 3840, 2160)

  await writeWebp('wallpaper-2-mobile.webp', renderMobile2(), 1170, 2532)

  await writeWebp('wallpaper-3-desktop.webp', renderDesktop3(), 3840, 2160)

  await writeWebp('wallpaper-3-mobile.webp', renderMobile3(), 1170, 2532)

  // also overwrite the default wallpaper.webp with desktop 2
  await writeWebp('wallpaper.webp', renderDesktop2(), 3840, 2160)

  console.log('Successfully generated 6 new wallpapers in assets/brand/wallpapers.')
}

main().catch(console.error)
