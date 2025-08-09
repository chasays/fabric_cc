import { test, expect } from '../../src/fixtures/user-fixture';
// todo
test.describe('Navigation Tests', () => {
  test('Verify Global Navigation Menu', async ({ page, homePage }) => {
    await homePage.navigate();
    await homePage.verifyGlobalNavigationMenuItems();
    // todo
  });
});
