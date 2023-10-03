import { expect, test } from '@playwright/test';

// Check that index page is not error page
test('index page is not error page', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Tady není nic k jídlu 😔' })).not.toBeVisible();
});

// Check that index has footer
test('index page has footer', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('contentinfo')).toBeVisible();
});
