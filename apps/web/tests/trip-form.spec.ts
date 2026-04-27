import { expect, test } from '@playwright/test'

test.describe('Trip form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#trip-country option[value="AR"]')).toBeAttached({ timeout: 30_000 })
    await page.locator('#counter').scrollIntoViewIfNeeded()
  })

  test('disables exit date when Currently there is checked', async ({ page }) => {
    const exit = page.locator('#trip-exit')
    const open = page.locator('#trip-open-ended')

    await expect(exit).toBeEnabled()
    await open.check()
    await expect(exit).toBeDisabled()
    await open.uncheck()
    await expect(exit).toBeEnabled()
  })

  test('shows validation error on trip form when exit is before entry', async ({ page }) => {
    await page.locator('#trip-country').selectOption('AR')
    await page.locator('#trip-entry').fill('2026-06-01')
    await page.locator('#trip-exit').fill('2026-05-01')
    await page.locator('#trip-form').getByRole('button', { name: 'Add trip' }).click()

    await expect(page.locator('#trip-form-status')).toContainText(/on or after entry/i)
    await expect(page.locator('#login-form #status')).not.toContainText(/on or after entry/i)
  })

  test('adds a closed trip and shows it in the travel log', async ({ page }) => {
    await page.locator('#trip-country').selectOption('AR')
    await page.locator('#trip-entry').fill('2026-01-10')
    await page.locator('#trip-exit').fill('2026-01-20')
    await page.locator('#trip-form').getByRole('button', { name: 'Add trip' }).click()

    const list = page.locator('#trip-list')

    await expect(list.getByText('Argentina')).toBeVisible()
    await expect(list).toContainText('Jan 10, 2026')
    await expect(list).toContainText('Jan 20, 2026')
  })
})
