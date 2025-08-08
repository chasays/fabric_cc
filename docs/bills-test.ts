import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill('diamondgerhold989816');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('Fabric!@#');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill('Fabric!@#');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="username"]').fill('Fabric!@#Fabric!@#');
  await page.locator('input[name="password"]').fill('Fabric!@#');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').press('ControlOrMeta+a');
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').press('ControlOrMeta+a');
  await page.locator('input[name="username"]').fill('diamondgerhold989816');
  await page.locator('body').click();
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill('rikxiao118');
  await page.locator('input[name="username"]').press('Tab');
  await page.locator('input[name="password"]').fill('123123');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByText('An internal error has').click();
  await page.locator('body').click();
  await page.locator('body').press('ControlOrMeta+Shift+c');
  await page.locator('body').click();
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').click();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.locator('[id="customer.firstName"]').click();
  await page.locator('[id="customer.firstName"]').click();
  await page.locator('[id="customer.firstName"]').fill('rikxiao123');
  await page.locator('[id="customer.firstName"]').press('Tab');
  await page.locator('[id="customer.lastName"]').fill('sha\'w');
  await page.locator('[id="customer.lastName"]').press('Enter');
  await page.locator('[id="customer.lastName"]').fill('shaw');
  await page.locator('[id="customer.lastName"]').press('Tab');
  await page.locator('[id="customer.address.street"]').fill('wuhouqu streen 234');
  await page.locator('[id="customer.address.street"]').press('Tab');
  await page.locator('[id="customer.address.city"]').fill('changshi');
  await page.locator('[id="customer.address.city"]').press('Tab');
  await page.locator('[id="customer.address.state"]').fill('hunan');
  await page.locator('[id="customer.address.state"]').press('Tab');
  await page.locator('[id="customer.address.zipCode"]').fill('21341');
  await page.locator('[id="customer.address.zipCode"]').press('Tab');
  await page.locator('[id="customer.phoneNumber"]').fill('51235444');
  await page.locator('[id="customer.phoneNumber"]').press('Tab');
  await page.locator('[id="customer.ssn"]').fill('2131234441');
  await page.locator('[id="customer.ssn"]').press('Tab');
  await page.locator('[id="customer.username"]').fill('rikxiao54');
  await page.locator('[id="customer.username"]').press('Tab');
  await page.locator('[id="customer.password"]').fill('123123');
  await page.locator('[id="customer.password"]').press('Tab');
  await page.locator('#repeatedPassword').fill('123123');
  await page.locator('[id="customer.username"]').click();
  await page.getByRole('button', { name: 'Register' }).click();
  await page.locator('body').click();
  await page.getByRole('link', { name: 'Open New Account' }).click();
  await page.locator('#type').selectOption('1');
  await page.getByText('What type of Account would you like to open? CHECKING SAVINGS A minimum of $200').click();
  await page.getByRole('button', { name: 'Open New Account' }).click();
  await page.getByText('Your new account number:').click();
  await page.getByRole('link', { name: '38430' }).click();
  await page.goto('https://parabank.parasoft.com/parabank/openaccount.htm');
  await page.getByRole('link', { name: 'Transfer Funds' }).click();
  await page.locator('#amount').click();
  await page.locator('#amount').fill('100');
  await page.locator('#toAccountId').selectOption('38430');
  await page.locator('#transferForm div').filter({ hasText: 'Transfer' }).click();
  await page.locator('body').click();
  await page.getByRole('button', { name: 'Transfer' }).click();
  await page.getByRole('link', { name: 'Find Transactions' }).click();
  await expect(page.locator('#leftPanel')).toContainText('Welcome rikxiao123 shaw');
  await page.locator('#type').selectOption('1');
  await expect(page.locator('#type')).toHaveValue('1');
  await expect(page.locator('#type')).toContainText('CHECKING SAVINGS');
  await expect(page.locator('#headerPanel')).toMatchAriaSnapshot(`
    - list:
      - listitem: Solutions
      - listitem:
        - link "About Us":
          - /url: about.htm
      - listitem:
        - link "Services":
          - /url: services.htm
      - listitem:
        - link "Products":
          - /url: http://www.parasoft.com/jsp/products.jsp
      - listitem:
        - link "Locations":
          - /url: http://www.parasoft.com/jsp/pr/contacts.jsp
      - listitem:
        - link "Admin Page":
          - /url: admin.htm
    - list:
      - listitem:
        - link "home":
          - /url: index.htm
      - listitem:
        - link "about":
          - /url: about.htm
      - listitem:
        - link "contact":
          - /url: contact.htm
    `);
  await expect(page.locator('#leftPanel')).toMatchAriaSnapshot(`
    - link "Open New Account":
      - /url: openaccount.htm
    `);
  await expect(page.locator('#leftPanel')).toMatchAriaSnapshot(`
    - link "Accounts Overview":
      - /url: overview.htm
    `);
  await expect(page.locator('#leftPanel')).toMatchAriaSnapshot(`
    - link "Transfer Funds":
      - /url: transfer.htm
    `);
  await page.getByText('What type of Account would you like to open? CHECKING SAVINGS A minimum of $200').click();
  await page.getByRole('button', { name: 'Open New Account' }).click();
  await expect(page.locator('#newAccountId')).toMatchAriaSnapshot(`
    - link /\\d+/:
      - /url: activity.htm?id=39207
    `);
});