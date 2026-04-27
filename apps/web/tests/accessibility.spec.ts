import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('homepage has no unexpected accessibility violations', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('#main-content')).toBeVisible()

  const results = await new AxeBuilder({ page }).analyze()

  expect(results.violations).toEqual([])
})
