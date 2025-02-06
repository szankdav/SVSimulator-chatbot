import { test, expect } from '@playwright/test';

test('/authors page should display the correct title and text', async ({ page }) => {
  await page.goto('http://localhost:3000/authors/1');
  await expect(page).toHaveTitle("Discord logger statisztika");
  await expect(page.locator('h4')).toHaveText('Here you can see the who sent a message on your server. If you want to see the messages for an author, click on an author!');
});