import { expect, test } from '@playwright/test'

test.describe('Modules smoke', () => {
	test('loads the characters module', async ({ page }) => {
		await page.goto('/characters')

		await expect(page).toHaveURL('/characters')
		await expect(page.getByRole('heading', { name: 'Characters', level: 1 })).toBeVisible()
		await expect(page.getByRole('table')).toBeVisible()
	})

	test('loads the universes module', async ({ page }) => {
		await page.goto('/universes')

		await expect(page).toHaveURL('/universes')
		await expect(page.getByRole('heading', { name: 'Universes', level: 1 })).toBeVisible()
		await expect(page.getByRole('table')).toBeVisible()
	})
})
