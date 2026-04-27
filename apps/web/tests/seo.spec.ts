import { expect, test } from '@playwright/test'

const siteUrl = 'https://nomad.santi020k.com/'

test('homepage exposes canonical and indexable metadata', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', siteUrl)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Track travel days, compare residency thresholds, and avoid surprise 183-day tax exposure as a digital nomad.'
  )
})

test('homepage has social preview metadata', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website')
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Nomad Counter')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${siteUrl}og-image.png`)
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
})

test('homepage has SoftwareApplication JSON-LD', async ({ page }) => {
  await page.goto('/')

  const raw = await page.locator('script[type="application/ld+json"]').textContent()
  const schema = JSON.parse(raw ?? '{}') as Record<string, unknown>

  expect(schema['@context']).toBe('https://schema.org')
  expect(schema['@type']).toBe('SoftwareApplication')
  expect(schema.name).toBe('Nomad Counter')
  expect(schema.url).toBe(siteUrl)
})
