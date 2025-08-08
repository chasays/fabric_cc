import { APIRequestContext, expect } from '@playwright/test';
import { config } from '../config/config';
import { Logger } from '../utils/logger';
import { Transaction } from '../types';

export class ParabankApi {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = config.apiUrl;
  }

  async findTransactionsByAmount(accountId: string, amount: number): Promise<Transaction[]> {
    const url = `${this.baseUrl}/accounts/${accountId}/transactions/amount/${amount}?timeout=30000`;
    Logger.info(`API Call: GET ${url}`);
    Logger.info(`API request:  ${this.request}`);
    
    const response = await this.request.get(url);
    expect(response.status()).toBe(200);
    
    const transactions = await response.json();
    Logger.info(`Found ${transactions.length} transactions`);
    
    return transactions.map((t: any) => ({
      id: t.id,
      date: t.date,
      description: t.description,
      type: t.type,
      amount: t.amount,
      accountId: t.accountId
    }));
  }

  async validateTransactionDetails(transaction: Transaction, expectedAmount: number): Promise<void> {
    expect(transaction.amount).toBe(expectedAmount);
    expect(transaction.id).toBeDefined();
    expect(transaction.date).toBeDefined();
    expect(transaction.type).toBeDefined();
    expect(transaction.description).toBeDefined();
    Logger.info(`Transaction validated: ID=${transaction.id}, Amount=${transaction.amount}, Type=${transaction.type}`);
  }
} 