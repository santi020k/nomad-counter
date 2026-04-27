import { expect, test } from '@playwright/test'

test('home page exposes the counter UI', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Nomad Counter')
  await expect(page.getByRole('heading', { name: 'Know your days before they count against you.' })).toBeVisible()
  await expect(page.getByRole('form', { name: 'Sign in' })).toBeVisible()
  await expect(page.getByText('Counting rule:')).toBeAttached()
})
