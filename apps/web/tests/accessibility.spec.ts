import { expectNoUnexpectedAccessibilityViolations } from './helpers/accessibility'

import { expect, test } from '@playwright/test'

const pages = [
  { name: 'homepage', path: '/' },
  { name: 'stats page', path: '/stats/' },
  { name: 'privacy page', path: '/privacy/' },
  { name: 'terms page', path: '/terms/' }
]

for (const pageUnderTest of pages) {
  test(`${pageUnderTest.name} has no unexpected accessibility violations`, async ({ page }) => {
    await page.goto(pageUnderTest.path)

    await expect(page.locator('#main-content')).toBeVisible()

    await expectNoUnexpectedAccessibilityViolations(page)
  })
}

test('retired homepage stays accessible on mobile in dark mode', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(page.locator('#main-content')).toBeVisible()
  await expectNoUnexpectedAccessibilityViolations(page)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)

  expect(overflow).toBe(false)
})
