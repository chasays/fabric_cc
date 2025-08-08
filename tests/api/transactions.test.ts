import { ParabankApi } from '../../src/api/parabank-api';
import { test, expect } from '../../src/fixtures/user-fixture';
import { LoginPage } from '../../src/pages/login-page';
import { Logger } from '../../src/utils/logger';

test.describe('API Tests - Transactions', () => {
  test('Find Transactions by Amount', async ({ request, page, registeredUser }) => {
    // First, login through UI to get authentication cookies
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(registeredUser);
    
    // Verify login was successful
    expect(await loginPage.isLoggedIn()).toBeTruthy();
    Logger.info('User logged in successfully for API test');
    
    // Create API instance with page context for authentication
    const api = new ParabankApi(request, page);
    
    // This test assumes a customer exists with transactions
    // In real implementation, you'd set up test data first
    const accountId = "37098"; // Example customer ID
    const amount = 100.00;
    
    const transactions = await api.findTransactionsByAmount(accountId, amount);
    
    expect(Array.isArray(transactions)).toBeTruthy();
    
    if (transactions.length > 0) {
      const transaction = transactions[0];
      await api.validateTransactionDetails(transaction, amount);
    }
  });
  
  test('API Response Schema Validation', async ({ request, page, registeredUser }) => {
    // First, login through UI to get authentication cookies
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(registeredUser);
    
    // Verify login was successful
    expect(await loginPage.isLoggedIn()).toBeTruthy();
    Logger.info('User logged in successfully for API schema validation test');
    
    // Create API instance with page context for authentication
    const api = new ParabankApi(request, page);
    const accountId = "12212";
    const amount = 50.00;
    
    const transactions = await api.findTransactionsByAmount(accountId, amount);
    
    if (transactions.length > 0) {
      const transaction = transactions[0];
      
      // Validate required fields exist
      expect(transaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('date');
      expect(transaction).toHaveProperty('description');
      expect(transaction).toHaveProperty('type');
      expect(transaction).toHaveProperty('amount');
      expect(transaction).toHaveProperty('accountId');
      
      // Validate data types
      expect(typeof transaction.id).toBe('string'); // Converted to string in our mapping
      expect(typeof transaction.amount).toBe('number');
      expect(typeof transaction.type).toBe('string');
      expect(typeof transaction.description).toBe('string');
      expect(typeof transaction.accountId).toBe('string'); // Converted to string in our mapping
    }
  });
}); 