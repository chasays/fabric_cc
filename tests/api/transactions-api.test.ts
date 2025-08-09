import { ParabankApi } from '../../src/api/parabank-api';
import { test, expect } from '../../src/fixtures/user-fixture';
import { Logger } from '../../src/utils/logger';
import { DataGenerator } from '../../src/utils/data-generator';
import { NewAccountPage } from '../../src/pages/new-account-page';
import { TransferFundsPage } from '../../src/pages/transfer-funds-page';
import { AccountsOverviewPage } from '../../src/pages/accounts-overview-page';
import { HomePage } from '../../src/pages/home-page';

test.describe('API Tests - Transactions', () => {
  test('Find Transactions by Amount - Independent API Test', async ({
    authenticatedApiContext,
  }) => {
    const { page, request, user } = authenticatedApiContext;
    Logger.info(`Starting API test with authenticated user: ${user.username}`);
    ///////////////////////////
    // start obtaining cookie from page context
    // Create API instance with authenticated context
    const api = new ParabankApi(request, page);

    // Set up test data through UI operations (minimal UI interaction for data setup)
    const homePage = new HomePage(page);
    const newAccountPage = new NewAccountPage(page);
    const accountsOverviewPage = new AccountsOverviewPage(page);
    const transferFundsPage = new TransferFundsPage(page);

    // Create a savings account for testing
    await homePage.clickOpenNewAccount();
    const savingsAccountNumber = await newAccountPage.createSavingsAccount();
    Logger.info(`Test account created: ${savingsAccountNumber}`);

    // Get account details
    await homePage.clickAccountsOverview();
    await accountsOverviewPage.verifyAccountExists(savingsAccountNumber);
    const accounts = await accountsOverviewPage.getAccountDetails();
    expect(accounts.length).toBeGreaterThan(0);

    // Create a transaction with known amount for testing
    const testAmount = 150.0;
    if (accounts.length >= 2) {
      await homePage.clickTransferFunds();
      await transferFundsPage.transferFunds(
        testAmount,
        accounts[0].accountId,
        accounts[1].accountId
      );
      Logger.info(
        `Test transaction created: ${testAmount} from ${accounts[0].accountId} to ${accounts[1].accountId}`
      );
    }
    // end obtaining cookie
    ///////////////////////////

    // Now test the API functionality
    Logger.info('Starting API test phase');

    // Test 1: Find transactions by amount
    const transactions = await api.findTransactionsByAmount(
      accounts[1].accountId,
      testAmount
    );

    // Validate API response structure
    expect(Array.isArray(transactions)).toBeTruthy();
    expect(transactions.length).toBeGreaterThan(0);
    Logger.info(`API returned ${transactions.length} transactions`);

    // Test 2: Validate specific transaction details
    const targetTransaction = transactions.find(
      t => Math.abs(t.amount - testAmount) < 0.01 // Handle floating point precision
    );
    expect(targetTransaction).toBeDefined();

    // Test 3: Validate transaction structure and data
    await api.validateTransactionDetails(targetTransaction!, testAmount);

    // Test 4: Additional API validations
    expect(targetTransaction!.accountId).toBe(accounts[1].accountId);
    expect(targetTransaction!.amount).toBe(testAmount);
    expect(targetTransaction!.id).toBeDefined();
    expect(targetTransaction!.date).toBeDefined();
    expect(targetTransaction!.type).toBeDefined();
    expect(targetTransaction!.type).toContain('Credit');
    expect(targetTransaction!.description).toBeDefined();
    expect(targetTransaction!.description).toContain('Funds Transfer Received');

    Logger.info('All API tests passed successfully');
  });

  test('Find Transactions by Amount - Error Handling', async ({
    authenticatedApiContext,
  }) => {
    const { page, request } = authenticatedApiContext;
    const api = new ParabankApi(request, page);

    // Test with non-existent account
    const nonExistentAccountId = '999999';
    const amount = 100.0;

    const transactions = await api.findTransactionsByAmount(
      nonExistentAccountId,
      amount
    );
    // Should return empty array for non-existent account
    expect(Array.isArray(transactions)).toBeTruthy();
    expect(transactions.length).toBe(0);
    Logger.info(
      `API correctly handled non-existent account: returned ${transactions.length} transactions`
    );
  });

  test('Find Transactions by Amount - Zero Amount', async ({
    authenticatedApiContext,
  }) => {
    const { page, request } = authenticatedApiContext;
    const api = new ParabankApi(request, page);

    // Set up minimal test data
    const homePage = new HomePage(page);
    const accountsOverviewPage = new AccountsOverviewPage(page);

    await homePage.clickAccountsOverview();
    const accounts = await accountsOverviewPage.getAccountDetails();

    if (accounts.length > 0) {
      // Test with zero amount
      const transactions = await api.findTransactionsByAmount(
        accounts[0].accountId,
        0
      );
      expect(Array.isArray(transactions)).toBeTruthy();
      Logger.info(
        `Zero amount search returned ${transactions.length} transactions`
      );
    }
  });
  //   add more api test CURD error handling, etc.
});
