import { expect, test } from '@playwright/test'

const siteUrl = 'https://nomad.santi020k.com/'

test('homepage exposes canonical and indexable metadata', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', siteUrl)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content', 'Nomad Counter is a retired travel-day tracking project. Explore its original design, inclusive day-counting approach, and archived source code.'
  )
})

test('homepage has social preview metadata', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website')
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Project archive — Nomad Counter')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${siteUrl}og-image.png`)
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
})

test('homepage has WebSite JSON-LD', async ({ page }) => {
  await page.goto('/')

  const raw = await page.locator('script[type="application/ld+json"]').textContent()
  const schema = JSON.parse(raw ?? '{}') as Record<string, unknown>

  expect(schema['@context']).toBe('https://schema.org')
  expect(schema['@type']).toBe('WebSite')
  expect(schema.name).toBe('Nomad Counter')
  expect(schema.url).toBe(siteUrl)
  expect(schema).not.toHaveProperty('offers')
})
