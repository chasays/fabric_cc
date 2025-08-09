import { ParabankApi } from '../../src/api/parabank-api';
import { test, expect } from '../../src/fixtures/user-fixture';
import { LoginPage } from '../../src/pages/login-page';
import { Logger } from '../../src/utils/logger';

test.describe('API Tests - Transactions', () => {
//   test('Find Transactions by Amount', async ({ request, page, registeredUser }) => {
//     // First, login through UI to get authentication cookies
//     const loginPage = new LoginPage(page);
//     await loginPage.navigate();
//     await loginPage.login(registeredUser);
    
//     // Verify login was successful
//     expect(await loginPage.isLoggedIn()).toBeTruthy();
//     Logger.info('User logged in successfully for API test');
    
//     // Create API instance with page context for authentication
//     const api = new ParabankApi(request, page);
    
//     // This test assumes a customer exists with transactions
//     // In real implementation, you'd set up test data first
//     const accountId = "37098"; // Example customer ID
//     const amount = 100.00;
    
//     const transactions = await api.findTransactionsByAmount(accountId, amount);
    
//     expect(Array.isArray(transactions)).toBeTruthy();
    
//     if (transactions.length > 0) {
//       const transaction = transactions[0];
//       await api.validateTransactionDetails(transaction, amount);
//     }
//   });
  
}); 