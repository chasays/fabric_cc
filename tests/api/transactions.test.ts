import { ParabankApi } from '../../src/api/parabank-api';
import { test, expect } from '../../src/fixtures/user-fixture';


test.describe('API Tests - Transactions', () => {
  test('Find Transactions by Amount', async ({ request, registeredUser }) => {
    const api = new ParabankApi(request);
    
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
  
  test('API Response Schema Validation', async ({ request }) => {
    const api = new ParabankApi(request);
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
      expect(typeof transaction.id).toBe('string');
      expect(typeof transaction.amount).toBe('number');
      expect(typeof transaction.type).toBe('string');
    }
  });
}); 