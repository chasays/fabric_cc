import { APIRequestContext, expect, Page } from '@playwright/test';
import { config } from '../config/config';
import { Logger } from '../utils/logger';
import { Transaction } from '../types';

export class ParabankApi {
  private request: APIRequestContext;
  private baseUrl: string;
  private page?: Page;

  constructor(request: APIRequestContext, page?: Page) {
    this.request = request;
    this.baseUrl = config.apiUrl;
    this.page = page;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Accept': '*/*',
      'Accept-Language': 'en,zh-CN;q=0.9,zh;q=0.8',
      'Connection': 'keep-alive',
      'Referer': `${config.baseUrl}/parabank/findtrans.htm`,
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest',
      'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"'
    };

    // If we have a page context, get cookies from it
    if (this.page) {
      const cookies = await this.page.context().cookies();
      const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
      if (cookieString) {
        headers['Cookie'] = cookieString;
        Logger.info(`Using cookies: ${cookieString}`);
      } else {
        Logger.warn('No cookies found from page context');
      }
    } else {
      Logger.warn('No page context provided, API calls may fail due to missing authentication');
    }

    return headers;
  }

  async findTransactionsByAmount(accountId: string, amount: number): Promise<Transaction[]> {
    const url = `${this.baseUrl}/accounts/${accountId}/transactions/amount/${amount}?timeout=30000`;
    Logger.info(`API Call: GET ${url}`);
    
    const headers = await this.getAuthHeaders();
    Logger.info(`Using headers: ${JSON.stringify(headers, null, 2)}`);
    
    const response = await this.request.get(url, { headers });
    
    if (response.status() === 401) {
      Logger.error('Authentication failed. Please ensure user is logged in before making API calls.');
      throw new Error('API authentication failed. User must be logged in to access this endpoint.');
    }
    
    const transactions = await response.json();
    Logger.info(`response body: ${JSON.stringify(transactions, null, 2)}`);
    expect(response.status()).toBe(200);
    
    // Map the API response to our Transaction interface
    return transactions.map((t: any) => ({
      id: t.id?.toString() || '',
      date: t.date?.toString() || '',
      description: t.description || '',
      type: t.type || '',
      amount: t.amount || 0,
      accountId: t.accountId?.toString() || ''
    }));
  }

  async validateTransactionDetails(transaction: Transaction, expectedAmount: number): Promise<void> {
    expect(transaction.amount).toBe(expectedAmount);
    expect(transaction.id).toBeDefined();
    expect(transaction.date).toBeDefined();
    expect(transaction.type).toBeDefined();
    expect(transaction.description).toBeDefined();
    expect(transaction.accountId).toBeDefined();
    Logger.info(`Transaction validated: ID=${transaction.id}, Amount=${transaction.amount}, Type=${transaction.type}, Description=${transaction.description}`);
  }
} 