import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class NewAccountPage extends BasePage {
  private readonly accountTypeSelect: Locator;
  private readonly fromAccountSelect: Locator;
  private readonly openAccountButton: Locator;
  private readonly accountNumberDisplay: Locator;
  private readonly confirmationMessage: Locator;

  constructor(page: Page) {
    super(page, '/parabank/openaccount.htm');
    this.accountTypeSelect = page.locator('#rightPanel #type');
    this.fromAccountSelect = page.locator('#rightPanel #fromAccountId');
    this.openAccountButton = page.locator('#openAccountForm input[type="button"][value="Open New Account"]');
    this.accountNumberDisplay = page.locator('#rightPanel #newAccountId');
    this.confirmationMessage = page.locator('#rightPanel .title:has-text("Account Opened!")');
  }

  async createSavingsAccount(): Promise<string> {
    await this.selectOption(this.accountTypeSelect, 'SAVINGS', 'Account Type');
    // Select the first available account as source
    await this.clickWithRetryAndCheck(this.openAccountButton, this.confirmationMessage, 'Open New Account button');
    
    // Wait for account creation confirmation
    await this.verifyText(this.confirmationMessage, 'Account Opened!', 'Account creation confirmation');
    
    // Get the new account number
    const accountNumber = await this.getText(this.accountNumberDisplay);
    return accountNumber;
  }
} 