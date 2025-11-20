import { test, expect } from '@playwright/test';

test.describe('Recipes', () => {
  test.beforeEach(async ({ page }) => {
    // Note: In a real scenario, you would need to authenticate first
    // For now, we'll test the public recipe list endpoint
    await page.goto('/recipes');
  });

  test('should display recipes page', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/recettes|recipes/i);
  });

  test('should navigate to recipe detail', async ({ page }) => {
    // Wait for recipes to load
    await page.waitForTimeout(1000);
    
    const recipeLinks = page.locator('a[href*="/recipes/"]');
    const count = await recipeLinks.count();
    
    if (count > 0) {
      await recipeLinks.first().click();
      await expect(page).toHaveURL(/.*\/recipes\/.*/);
    }
  });
});

