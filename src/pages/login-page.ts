import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { User } from '../types';
import { Logger } from '../utils/logger';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly registerLink: Locator;
  private readonly errorMessage: Locator;
  private readonly logOutButton: Locator;

  constructor(page: Page) {
    super(page, '/parabank/index.htm');
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[value="Log In"]');
    this.registerLink = page.locator('a:has-text("Register")');
    this.errorMessage = page.locator('.error');
    this.logOutButton = page.locator('a:has-text("Log Out")');
  }
  
  // add logout
  async logout(): Promise<void> {
    await this.clickElement(this.logOutButton, 'Log Out button');
  }

  async login(user: User): Promise<void> {
    // log in if check log out button is visible
    if (await this.logOutButton.isVisible()) {
      return;
    }
   
    const maxRetries = 3;
    const retryDelay = 3000; // 3 seconds
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        Logger.info(`Login attempt ${attempt}/${maxRetries} for user: ${user.username}`);
        
        await this.fillElement(this.usernameInput, user.username, 'Username');
        await this.fillElement(this.passwordInput, user.password, 'Password');
        await this.clickElement(this.loginButton, 'Login button');
        
        // Wait for login to complete and check for logout button
        try {
          await this.waitForLoginSuccess(3000); // Wait up to 5 seconds for login success
          Logger.info(`Login successful on attempt ${attempt}`);
          return;
        } catch (error) {
          Logger.info(`Login attempt ${attempt} failed - logout button not found`);
        }
        
        // If logout button is not visible, login might have failed
        if (attempt < maxRetries) {
          Logger.warn(`Login attempt ${attempt} failed, waiting ${retryDelay}ms before retry...`);
          await this.page.waitForTimeout(retryDelay);
          
          // Clear the form for next attempt
          await this.usernameInput.clear();
          await this.passwordInput.clear();
        }
      } catch (error) {
        Logger.error(`Login attempt ${attempt} failed with error: ${error}`);
        if (attempt < maxRetries) {
          Logger.warn(`Waiting ${retryDelay}ms before retry...`);
          await this.page.waitForTimeout(retryDelay);
        } else {
          throw new Error(`Login failed after ${maxRetries} attempts: ${error}`);
        }
      }
    }
    
    // If we get here, all attempts failed
    throw new Error(`Login failed after ${maxRetries} attempts - logout button not found`);
  }

  async clickRegisterLink(): Promise<void> {
    await this.clickElement(this.registerLink, 'Register link');
  }

  async verifyLoginError(): Promise<void> {
    await this.verifyElementVisible(this.errorMessage, 'Login error message');
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.logOutButton.isVisible();
  }

  async waitForLoginSuccess(timeout: number = 10000): Promise<void> {
    await this.logOutButton.waitFor({ timeout });
  }
}