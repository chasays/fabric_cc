import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class HomePage extends BasePage {
  // global nav items
  private readonly aboutUsLink: Locator;
  private readonly servicesLink: Locator;
  private readonly productsLink: Locator;
  private readonly locationsLink: Locator;
  private readonly adminPageLink: Locator;
  // todo: add more nav items
  private readonly welcomeMessage: Locator;
  private readonly welcomeMessageLeftNav: Locator;
  private readonly openNewAccountLink: Locator;
  private readonly accountsOverviewLink: Locator;
  private readonly transferFundsLink: Locator;
  private readonly billPayLink: Locator;
  private readonly findTransactionsLink: Locator;
  private readonly updateContactInfoLink: Locator;
  private readonly requestLoanLink: Locator;
  private readonly logoutLink: Locator;
  private readonly navigationMenu: Locator;
  private readonly headerPanel: Locator;

  constructor(page: Page) {
    super(page, '/parabank/overview.htm');
    // global nav items
    this.headerPanel = page.locator('#headerPanel');
    this.aboutUsLink = page.locator('#headerPanel a[href="about.htm"]');
    this.servicesLink = page.locator('#headerPanel a[href="services.htm"]');
    // todo
    this.productsLink = page.locator('#headerPanel a[href="http://www.parasoft.com/jsp/pr/contacts.jsp"]');
    this.locationsLink = page.locator('#headerPanel a[href="http://www.parasoft.com/jsp/pr/contacts.jsp"]');
    this.adminPageLink = page.locator('#headerPanel a[href="admin.htm"]');
    // welcome message
    this.welcomeMessage = page.locator('#leftPanel h1.title');
    this.welcomeMessageLeftNav = page.locator('#leftPanel p.smallText');
    this.openNewAccountLink = page.locator('#leftPanel a[href="openaccount.htm"]');
    this.accountsOverviewLink = page.locator('#leftPanel a[href="overview.htm"]');
    this.transferFundsLink = page.locator('#leftPanel a[href="transfer.htm"]');
    this.billPayLink = page.locator('#leftPanel a[href="billpay.htm"]');
    this.findTransactionsLink = page.locator('#leftPanel a[href="findtrans.htm"]');
    this.updateContactInfoLink = page.locator('#leftPanel a[href="updateprofile.htm"]');
    this.requestLoanLink = page.locator('#leftPanel a[href="requestloan.htm"]');
    this.logoutLink = page.locator('#leftPanel a[href="logout.htm"]');
    this.navigationMenu = page.locator('#leftPanel ul');
  }

  async verifyWelcomeMessage(username: string): Promise<void> {
    await this.verifyText(this.welcomeMessage, `Welcome ${username}`, 'Welcome message');
  }

  async verifyWelcomeMessageLeftNav(): Promise<void> {
    await this.verifyText(this.welcomeMessageLeftNav, `Welcome`, 'Welcome message');
  }

  async verifyGlobalNavigationMenuItems(): Promise<void> {
    const expectedMenuItems = [
      'About Us',
      'Services', 
      'Products',
      'Locations',
      'Admin Page'
    ];

    for (const item of expectedMenuItems) {
      const menuItemLocator = this.page.locator(`#headerPanel a:has-text("${item}")`);
      await this.verifyElementVisible(menuItemLocator, `${item} menu item`);
    }
    
    // verify Solutions item (not li)
    const solutionsLocator = this.page.locator('#headerPanel li.Solutions:has-text("Solutions")');
    await this.verifyElementVisible(solutionsLocator, 'Solutions menu item');
  }

  async verifyNavigationMenuItems(): Promise<void> {
    const expectedMenuItems = [
      'Open New Account',
      'Accounts Overview',
      'Transfer Funds',
      'Bill Pay',
      'Find Transactions',
      'Update Contact Info',
      'Request Loan',
      'Log Out'
    ];

    for (const item of expectedMenuItems) {
      // all menu items use left panel locator
      const menuItemLocator = this.page.locator(`#leftPanel a:has-text("${item}")`);
      await this.verifyElementVisible(menuItemLocator, `${item} menu item`);
    }
  }

  async clickOpenNewAccount(): Promise<void> {
    await this.clickElement(this.openNewAccountLink, 'Open New Account link');
  }

  async clickAccountsOverview(): Promise<void> {
    await this.clickElement(this.accountsOverviewLink, 'Accounts Overview link');
  }

  async clickTransferFunds(): Promise<void> {
    await this.clickElement(this.transferFundsLink, 'Transfer Funds link');
  }

  async clickBillPay(): Promise<void> {
    await this.clickElement(this.billPayLink, 'Bill Pay link');
  }

  async clickFindTransactions(): Promise<void> {
    await this.clickElement(this.findTransactionsLink, 'Find Transactions link');
  }

  async logout(): Promise<void> {
    await this.clickElement(this.logoutLink, 'Logout link');
  }

  async verifyHeaderPanel(): Promise<void> {
    await this.verifyElementVisible(this.headerPanel, 'Header panel');
  }
} 