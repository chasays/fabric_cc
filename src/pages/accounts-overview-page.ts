import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { Account } from '../types';

export class AccountsOverviewPage extends BasePage {
  private readonly accountsTable: Locator;
  private readonly totalBalance: Locator;

  constructor(page: Page) {
    super(page, '/parabank/overview.htm');
    this.accountsTable = page.locator('#accountTable');
    this.totalBalance = page.locator('b.ng-binding').last();
  }

  async getAccountDetails(): Promise<Account[]> {
    await this.waitForElement(this.accountsTable);

    const accounts: Account[] = [];
    const rows = await this.accountsTable.locator('tbody tr').all();

    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 3) {
        const accountNumber = (await cells[0].textContent()) || '';
        const balance = parseFloat(
          ((await cells[1].textContent()) || '').replace(', ', '')
        );
        const availableAmount = parseFloat(
          ((await cells[2].textContent()) || '').replace(', ', '')
        );

        accounts.push({
          accountId: accountNumber,
          accountNumber: accountNumber,
          type: 'CHECKING', // Default, can be enhanced to detect actual type
          balance: balance,
        });
      }
    }

    return accounts;
  }

  async verifyAccountExists(accountNumber: string): Promise<void> {
    const accountLink = this.page.locator(`a[href*="${accountNumber}"]`);
    await this.verifyElementVisible(accountLink, `Account ${accountNumber}`);
  }

  async verifyTotalBalance(): Promise<number> {
    const balanceText = await this.getText(this.totalBalance);
    const balance = parseFloat(balanceText.replace(', ', ''));
    return balance;
  }
}
