import { expect, test } from '@playwright/test'

test('public routes stay readable without API requests or account controls', async ({ page }) => {
  const apiRequests: string[] = []

  page.on('request', request => {
    if (/api\.nomad|\/api\//.test(request.url())) apiRequests.push(request.url())
  })

  for (const path of ['/', '/stats/', '/privacy/', '/terms/']) {
    await page.goto(path)
    await expect(page.locator('#main-content')).toBeVisible()
    await expect(page.getByText(/retired/i).first()).toBeVisible()
    await expect(page.locator('form, input[type="email"]')).toHaveCount(0)
    await expect(page.locator('a[href="#counter"], a[href="/#counter"]')).toHaveCount(0)
  }

  expect(apiRequests).toEqual([])
})

test('past statistics explain retirement without fabricated totals', async ({ page }) => {
  await page.goto('/stats/')

  await expect(page.getByRole('heading', { name: 'Live statistics have ended' })).toBeVisible()
  await expect(page.getByText(/No historical totals are presented here/)).toBeVisible()
  await expect(page.getByRole('link', { name: 'View the original interface and project story' })).toHaveAttribute('href', '/#history')
})

test('Spanish visitors see the retired status', async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() => document.querySelectorAll('astro-island[ssr]').length === 0)
  await page.getByRole('button', { name: 'Español' }).click()

  await expect(page.getByText('Proyecto retirado · Archivo histórico')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Un proyecto que conserva su historia.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Historia del proyecto' })).toHaveAttribute('href', '#history')
})

test('the archive stays readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()

  await page.goto('/')
  await expect(page.getByText('Retired project · Historical showcase')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'A clearer picture of time spent abroad.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View the source code' })).toBeVisible()

  await context.close()
})

test('the showcase preserves existing local travel records', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('nomad-counter:trips', 'existing-trip-records')
    localStorage.setItem('nomad-counter:home-countries', 'existing-country-records')
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'A project kept for its story.' })).toBeVisible()

  const stored = await page.evaluate(() => ({
    trips: localStorage.getItem('nomad-counter:trips'),
    countries: localStorage.getItem('nomad-counter:home-countries')
  }))

  expect(stored).toEqual({ trips: 'existing-trip-records', countries: 'existing-country-records' })
})
