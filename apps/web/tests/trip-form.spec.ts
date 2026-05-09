import { expect, type Page, test } from '@playwright/test'

async function selectTripCountry(page: Page, country: string) {
  const input = page.locator('#trip-country-input')

  await input.click()

  await input.fill(country)

  const listbox = page.locator('#trip-country-listbox')

  await expect(listbox).toBeVisible({ timeout: 10_000 })

  await listbox.getByRole('option').filter({ hasText: country }).first().click()
}

test.describe('Trip form', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear()
    })

    await page.goto('/')

    await expect(page.locator('#trip-country-input')).toBeVisible({ timeout: 30_000 })

    await page.waitForFunction(() => document.querySelectorAll('astro-island[ssr]').length === 0)

    await page.locator('#counter').scrollIntoViewIfNeeded()
  })

  test('disables exit date when Currently there is checked', async ({ page }) => {
    const exit = page.locator('#trip-exit')
    const open = page.locator('#trip-open-ended')

    await expect(exit).toBeEnabled()

    await page.locator('label').filter({ has: open }).click({ force: true })

    await expect(exit).toBeDisabled()

    await page.locator('label').filter({ has: open }).click({ force: true })

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

  test('edits an existing trip from the travel log', async ({ page }) => {
    await selectTripCountry(page, 'Argentina')

    await page.locator('#trip-entry').fill('2026-01-10')

    await page.locator('#trip-exit').fill('2026-01-20')

    await page.locator('#trip-form').getByRole('button', { name: 'Add trip' }).click()

    await page.getByRole('button', { name: 'Edit Argentina' }).click()

    await expect(page.locator('#trip-form').getByRole('button', { name: 'Update trip' })).toBeVisible()

    await page.locator('#trip-exit').fill('2026-01-22')

    await page.locator('#trip-form').getByRole('button', { name: 'Update trip' }).click()

    await expect(page.locator('#trip-list')).toContainText('Jan 22, 2026')
  })

  test('switches the counter interface to Spanish', async ({ page }) => {
    await page.getByRole('button', { name: 'Español' }).click()

    await expect(page.getByRole('heading', { name: 'Conteo de días por país' })).toBeVisible()

    await expect(page.locator('#trip-form').getByRole('button', { name: 'Agregar viaje' })).toBeVisible()
  })
})
