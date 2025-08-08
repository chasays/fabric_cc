import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { BillPayment } from '../types';

export class BillPayPage extends BasePage {
  private readonly payeeNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly phoneNumberInput: Locator;
  private readonly accountNumberInput: Locator;
  private readonly verifyAccountNumberInput: Locator;
  private readonly amountInput: Locator;
  private readonly fromAccountSelect: Locator;
  private readonly sendPaymentButton: Locator;
  private readonly confirmationMessage: Locator;

  constructor(page: Page) {
    super(page, '/parabank/billpay.htm');
    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.addressInput = page.locator('input[name="payee.address.street"]');
    this.cityInput = page.locator('input[name="payee.address.city"]');
    this.stateInput = page.locator('input[name="payee.address.state"]');
    this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
    this.phoneNumberInput = page.locator('input[name="payee.phoneNumber"]');
    this.accountNumberInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountNumberInput = page.locator('input[name="verifyAccount"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountSelect = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton = page.locator('input[value="Send Payment"]');
    this.confirmationMessage = page.locator('.title:has-text("Bill Payment Complete")');
  }

  async payBill(billPayment: BillPayment): Promise<void> {
    // Set verify account number to same as account number
    billPayment.verifyAccountNumber = billPayment.accountNumber;

    await this.fillElement(this.payeeNameInput, billPayment.payeeName, 'Payee Name');
    await this.fillElement(this.addressInput, billPayment.address, 'Address');
    await this.fillElement(this.cityInput, billPayment.city, 'City');
    await this.fillElement(this.stateInput, billPayment.state, 'State');
    await this.fillElement(this.zipCodeInput, billPayment.zipCode, 'Zip Code');
    await this.fillElement(this.phoneNumberInput, billPayment.phoneNumber, 'Phone Number');
    await this.fillElement(this.accountNumberInput, billPayment.accountNumber, 'Account Number');
    await this.fillElement(this.verifyAccountNumberInput, billPayment.verifyAccountNumber, 'Verify Account Number');
    await this.fillElement(this.amountInput, billPayment.amount.toString(), 'Amount');
    await this.selectOption(this.fromAccountSelect, billPayment.fromAccountId, 'From Account');
    await this.clickElement(this.sendPaymentButton, 'Send Payment button');
    await this.verifyText(this.confirmationMessage, 'Bill Payment Complete', 'Payment confirmation');
  }
} 