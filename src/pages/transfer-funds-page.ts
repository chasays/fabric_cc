import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class TransferFundsPage extends BasePage {
  private readonly amountInput: Locator;
  private readonly fromAccountSelect: Locator;
  private readonly toAccountSelect: Locator;
  private readonly transferButton: Locator;
  private readonly confirmationMessage: Locator;

  constructor(page: Page) {
    super(page, '/parabank/transfer.htm');
    this.amountInput = page.locator('#rightPanel #amount');
    this.fromAccountSelect = page.locator('#rightPanel #fromAccountId');
    this.toAccountSelect = page.locator('#rightPanel #toAccountId');
    this.transferButton = page.locator('#rightPanel input[value="Transfer"]');
    this.confirmationMessage = page.locator(
      '#rightPanel .title:has-text("Transfer Complete!")'
    );
  }

  async transferFunds(
    amount: number,
    fromAccountId: string,
    toAccountId: string
  ): Promise<void> {
    await this.fillElement(
      this.amountInput,
      amount.toString(),
      'Transfer Amount'
    );
    await this.selectOption(
      this.fromAccountSelect,
      fromAccountId,
      'From Account'
    );
    await this.selectOption(this.toAccountSelect, toAccountId, 'To Account');
    await this.clickElement(this.transferButton, 'Transfer button');
    await this.verifyText(
      this.confirmationMessage,
      'Transfer Complete!',
      'Transfer confirmation'
    );
  }
}
