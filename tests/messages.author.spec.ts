import { test, expect } from '@playwright/test';

test('/messages/author page should display the correct title and text', async ({ page }) => {
    await page.goto('http://localhost:3000/messages/author/1');
    await expect(page).toHaveTitle("Discord logger statisztika");
    await expect(page.getByRole('heading').nth(0)).toHaveText('Here you can see the messages sent by the selected author.');
});