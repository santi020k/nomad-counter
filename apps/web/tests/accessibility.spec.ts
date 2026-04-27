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
