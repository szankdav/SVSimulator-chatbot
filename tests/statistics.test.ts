import { test, expect } from '@playwright/test';

test('/statistics/author page should display the correct title and text', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics/author/1');
    await expect(page).toHaveTitle("Discord logger statisztika");
    await expect(page.getByRole('heading').nth(0)).toHaveText('Author:');
});

test('/statistics/author page navigation buttons should work correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics/author/1');
    const buttons = page.getByRole('link');
    buttons.nth(5).click();

    await expect(page).toHaveURL('http://localhost:3000/statistics/author/2');


    buttons.nth(4).click();

    await expect(page).toHaveURL('http://localhost:3000/statistics/author/1');

    buttons.nth(6).click();

    await expect(page).toHaveURL('http://localhost:3000/messages/author/1');
});

test('/statistics/author page Show/Hide statistic button should work correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/statistics/author/1');
    const showHidebutton = page.getByRole('button');
    await showHidebutton.click();
    await expect(page.getByRole('heading').nth(1)).toHaveText('Here you can see the usage rate of each letter out of all the letters typed by the author:');
    const progressBars = await page.getByRole('progressbar').count();
    expect(progressBars).toBe(35);
});