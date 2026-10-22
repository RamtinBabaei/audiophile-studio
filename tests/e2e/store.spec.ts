import { test, expect } from '@playwright/test';
test('browse, add, persist, validate and place a demo order', async ({ page }) => {
  await page.goto('/product/xx99-mark-two-headphones');
  await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Open cart, 1 items' }).click();
  await expect(page.getByRole('dialog')).toContainText('XX99 Mark II');
  await page.getByRole('link', { name: 'Checkout', exact: true }).click();
  await page.getByRole('button', { name: 'Place demo order' }).click();
  await expect(page.getByRole('alert')).toContainText('highlighted');
  for (const [name, value] of Object.entries({
    Name: 'Alex Johnson',
    'Email address': 'alex@example.com',
    'Phone number': '+1 202 555 0146',
    'Your address': '1137 Williams Avenue',
    'ZIP / postal code': '10001',
    City: 'New York',
    Country: 'United States',
    'e-Money number': '123456789',
    'e-Money PIN': '1234',
  }))
    await page.getByLabel(name, { exact: true }).fill(value);
  await page.getByRole('button', { name: 'Place demo order' }).click();
  await expect(page.getByRole('dialog', { name: 'Order confirmation' })).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('$3,049');
  await page.getByRole('button', { name: 'Back to home', exact: true }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('button', { name: 'Open cart, 0 items' })).toBeVisible();
});
test('does not overflow the viewport', async ({ page }) => {
  for (const path of [
    '/',
    '/headphones',
    '/speakers',
    '/earphones',
    '/product/yx1-earphones',
    '/checkout',
  ]) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});
