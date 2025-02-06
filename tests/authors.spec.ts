import { test, expect } from '@playwright/test';

test('/authors page should display the correct title and text', async ({ page }) => {
  await page.goto('http://localhost:3000/authors/1');
  await expect(page).toHaveTitle("Discord logger statisztika");
  await expect(page.locator('h4')).toHaveText('Here you can see the who sent a message on your server. If you want to see the messages for an author, click on an author!');
});

test('/authors page should display a list of 10 authors', async ({ page }) => {
  await page.goto('http://localhost:3000/authors/1');

  await page.waitForSelector('.authorRow');

  const authors = await page.locator('.authorRow').count();
  expect(authors).toBe(10);
});

test('/authors page navigation buttons should work correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/authors/1');

  await page.click('#nextButton');
  await expect(page).toHaveURL(/.2/);

  await page.click('#previousButton');
  await expect(page).toHaveURL(/.1/);

  await page.click('#secondPageNumberButton');
  await expect(page).toHaveURL(/.2/);

  await page.click('#thirdPageNumberButton');
  await expect(page).toHaveURL(/.3/);

  await page.click('#thirdPageNumberButton');
  await expect(page).toHaveURL(/.4/);

  await page.click('#firstPageNumberButton');
  await expect(page).toHaveURL(/.3/);
});

test('/authors page click on author name should open author messages', async ({ page }) => {
  await page.goto('http://localhost:3000/authors/1');

  await page.waitForSelector('.authorRow');

  const authors = page.locator('.authorRow');
  await authors.first().click();
  await expect(page).toHaveURL("http://localhost:3000/messages/author/1");
});