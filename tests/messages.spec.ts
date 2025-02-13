import { test, expect } from '@playwright/test';

test('/messages page should display the correct text with empty database', async ({ page }) => {
  await page.goto('http://localhost:3000/messages/100000000');
  await expect(page).toHaveTitle("Discord logger statisztika");
  await expect(page.locator('h4')).toHaveText('No messages to show... Are you sure you are at the right URL? ');
  await expect(page.getByTestId('goBack')).toHaveText('Go back to home page');
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
  const dataId = await authors.first().getAttribute("data-authorid");
  await authors.first().click();
  await expect(page).toHaveURL(`http://localhost:3000/messages/author/${dataId}`);
});

test('/messages/author page should display the correct title and text', async ({ page }) => {
  await page.goto('http://localhost:3000/messages/author/1');
  await expect(page).toHaveTitle("Discord logger statisztika");
  await expect(page.locator('h4')).toHaveText('Here you can see the messages sent by the selected author.');
  await expect(page.locator('h3')).toHaveText('Author:');
});