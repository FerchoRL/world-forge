import { expect, test } from '@playwright/test'

test.describe('App smoke', () => {
	test('loads the homepage', async ({ page }) => {
		// Smoke: validate that the main homepage shell renders.
		await page.goto('/')

		// Keep assertions minimal so this only detects broken app startup or rendering.
		await expect(page).toHaveURL('/')
		await expect(page.getByTestId('app-sidebar')).toBeVisible()
		await expect(page.getByRole('heading', { name: 'World-Forge' })).toBeVisible()
		await expect(page.getByTestId('dashboard-page')).toBeVisible()
		await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible()
		await expect(page.getByTestId('dashboard-quick-actions')).toBeVisible()
	})
})
