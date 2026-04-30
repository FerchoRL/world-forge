import { expect, test } from '@playwright/test'

test('homepage navigates to the universes list from the dashboard card', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  //explicit wait
  await page.waitForTimeout(1000)

  const universesCard = page
    .locator('article')
    .filter({ has: page.getByRole('heading', { name: 'Universes' }) })

  await expect(universesCard).toBeVisible()
  await universesCard.getByRole('link', { name: /View all/i }).click()

  await expect(page).toHaveURL('/universes')
  await expect(page.getByRole('heading', { name: 'Universes' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'New Universe' })).toBeVisible()
  await expect(page.getByPlaceholder('Search universes...')).toBeVisible()
})