import { expect, test } from '@playwright/test'

test('home page presents the retired project and its original interface', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Project archive — Nomad Counter')
  await expect(page.getByRole('heading', { name: 'Know your days before they count against you.' })).toBeVisible()
  await expect(page.getByText('Retired project · Historical showcase')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'A project kept for its story.' })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Original Nomad Counter interface', exact: false })).toBeAttached()
  await expect(page.locator('form')).toHaveCount(0)
  await expect(page.locator('#counter')).toHaveCount(0)
})
