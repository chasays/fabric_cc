import { test, expect } from '../../src/fixtures/user-fixture';
import { NewAccountPage } from '../../src/pages/new-account-page';
import { AccountsOverviewPage } from '../../src/pages/accounts-overview-page';
import { TransferFundsPage } from '../../src/pages/transfer-funds-page';
import { BillPayPage } from '../../src/pages/bill-pay-page';
import { ParabankApi } from '../../src/api/parabank-api';
import { DataGenerator } from '../../src/utils/data-generator';
import { Logger } from '../../src/utils/logger';
import { HomePage } from '../../src/pages/home-page';

test.describe('Parabank E2E Tests', () => {
  test('Complete Parar-Banking Workflow - Registration to Bill Payment', async ({ 
    page, 
    request,
    loginPage, 
    registrationPage, 
    homePage, 
    registeredUser 
  }) => {
    Logger.info('Starting complete E2E banking workflow test');
    
    // Step 1: User is already registered through fixture
    Logger.info(`User registered successfully: ${registeredUser.username}`);
    
    // Step 2: Login with created user
    await loginPage.navigate();
    await loginPage.login(registeredUser);
    
    // Step 4: Verify navigation menu
    await homePage.verifyWelcomeMessageLeftNav();
    await homePage.verifyGlobalNavigationMenuItems();
    await homePage.verifyNavigationMenuItems();
    Logger.info('Navigation menu verification completed');
    // todo add more
  }); 
}); 