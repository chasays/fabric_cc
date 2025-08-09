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
    
    // Step 5: Create a Savings Account
    const newAccountPage = new NewAccountPage(page);
    await homePage.clickOpenNewAccount();
    const savingsAccountNumber = await newAccountPage.createSavingsAccount();
    Logger.info(`Savings account created: ${savingsAccountNumber}`);
    
    // Step 6: Verify Account Overview and check balance
    const accountsOverviewPage = new AccountsOverviewPage(page);
    await homePage.clickAccountsOverview();
    await accountsOverviewPage.verifyAccountExists(savingsAccountNumber);
    const accounts = await accountsOverviewPage.getAccountDetails();
    expect(accounts.length).toBeGreaterThan(0);
    Logger.info(`Account overview verified. Found ${accounts.length} accounts`);
    
    // Step 7: Transfer Funds
    const transferFundsPage = new TransferFundsPage(page);
    await homePage.clickTransferFunds();
    
    // Ensure we have at least 2 accounts for transfer
    const transferAmount = 101;
    if (accounts.length >= 2) {
      await transferFundsPage.transferFunds(
        transferAmount, 
        accounts[0].accountId, 
        accounts[1].accountId
      );
      Logger.info(`Funds transferred: ${transferAmount} from ${accounts[0].accountId} to ${accounts[1].accountId}`);
    }
    
    // Step 8: Pay Bill
    const billPayPage = new BillPayPage(page);
    await homePage.clickBillPay();
    
    const billPayment = DataGenerator.generateBillPayment(savingsAccountNumber);
    await billPayPage.payBill(billPayment);
    Logger.info(`Bill payment completed: ${billPayment.amount} to ${billPayment.payeeName}`);
    
    // we can use save cookie to local file and use cookie to api test.
    
    // Step 9: API Test - Find Transactions
    const parabankApi = new ParabankApi(request, page);

    // Search for transactions by amount - use the transfer amount since we know it exists
    const transactions = await parabankApi.findTransactionsByAmount(accounts[1].accountId, transferAmount);

    // Step 10: Validate API Response
    expect(transactions.length).toBeGreaterThan(0);
    
    // Find the bill payment transaction
    const billPaymentTransaction = transactions.find(t => 
      Math.abs(t.amount - transferAmount) < 0.01 // Handle floating point precision
    );
    expect(billPaymentTransaction).toBeDefined();
    await parabankApi.validateTransactionDetails(billPaymentTransaction!, transferAmount);
    
    Logger.info('UI test completed successfully');
  });
}); 