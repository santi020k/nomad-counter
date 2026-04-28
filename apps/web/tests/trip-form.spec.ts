import { expect, type Page, test } from '@playwright/test'

async function selectTripCountry(page: Page, country: string) {
  const input = page.locator('#trip-country-input')

  await input.click()

  await input.fill(country)

  const listbox = page.locator('#trip-country-listbox')

  await expect(listbox).toBeVisible()

  await listbox.getByRole('option').filter({ hasText: country }).first().click()
}

test.describe('Trip form', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear()
    })

    await page.goto('/')

    await expect(page.locator('#trip-country-input')).toBeVisible({ timeout: 30_000 })

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
    await selectTripCountry(page, 'Argentina')

    await page.locator('#trip-entry').fill('2026-06-01')

    await page.locator('#trip-exit').fill('2026-05-01')

    await page.locator('#trip-form').getByRole('button', { name: 'Add trip' }).click()

    await expect(page.locator('#trip-form-status')).toContainText(/on or after entry/i)
  })

  test('adds a closed trip and shows it in the travel log', async ({ page }) => {
    await selectTripCountry(page, 'Argentina')

    await page.locator('#trip-entry').fill('2026-01-10')

    await page.locator('#trip-exit').fill('2026-01-20')

    await page.locator('#trip-form').getByRole('button', { name: 'Add trip' }).click()

    const list = page.locator('#trip-list')

    await expect(list.getByText('Argentina')).toBeVisible()

    await expect(list).toContainText('Jan 10, 2026')

    await expect(list).toContainText('Jan 20, 2026')
  })
})
