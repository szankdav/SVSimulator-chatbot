import { test, expect } from '@playwright/test';

test('/messages page should display the correct title and text', async ({ page }) => {
  await page.goto('http://localhost:3000/messages/1');
  await expect(page).toHaveTitle("Discord logger statisztika");
  await expect(page.locator('h4')).toHaveText('Here you can see all the messages sent on your server! If you want to see an author\'s messages, click on the author\'s name!');
});

test('/messages page should display a list of 10 messages', async ({ page }) => {
  await page.goto('http://localhost:3000/messages/1');

  await page.waitForSelector('.messageRow');

  const authors = await page.locator('.messageRow').count();
  expect(authors).toBe(10);
});

test('/messages page navigation buttons should work correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/messages/1');

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

test('/messages page click on author name should open author"s every messages', async ({ page }) => {
  await page.goto('http://localhost:3000/messages/1');

  await page.waitForSelector('.authorName');

  const authors = page.locator('.authorName');
  await authors.first().click();
  await expect(page).toHaveURL("http://localhost:3000/messages/author/1");
});

test('/messages/author page should display the correct title and text', async ({ page }) => {
  await page.goto('http://localhost:3000/messages/author/1');
  await expect(page).toHaveTitle("Discord logger statisztika");
  await expect(page.locator('h4')).toHaveText('Here you can see the messages sent by the selected author.');
  await expect(page.locator('h3')).toHaveText('Author:');
});

test('/messages/author page navigation buttons should work correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/messages/author/1');
  const buttons = page.getByRole('link');
  buttons.nth(4).click();

  await expect(page).toHaveURL('http://localhost:3000/authors/1');

  await page.goBack();

  buttons.nth(5).click();

  await expect(page).toHaveURL('http://localhost:3000/messages/1');

  await page.goBack();

  buttons.nth(6).click();

  await expect(page).toHaveURL('http://localhost:3000/statistics/author/1');
});