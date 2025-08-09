import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

export abstract class BasePage {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.url = url;
  }

  async navigate(): Promise<void> {
    Logger.info(`Navigating to: ${this.url}`);
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForElement(locator: Locator, timeout: number = 15000): Promise<void> {
    await locator.waitFor({ timeout });
  }

  async clickElement(locator: Locator, description: string): Promise<void> {
    Logger.info(`Clicking: ${description}`);
    await this.waitForElement(locator);
    await locator.click();
  }

  async fillElement(locator: Locator, value: string, description: string): Promise<void> {
    Logger.info(`Filling ${description} with: ${value}`);
    await this.waitForElement(locator);
    await locator.fill(value);
  }

  async selectOption(locator: Locator, value: string, description: string): Promise<void> {
    Logger.info(`Selecting ${description}: ${value}`);
    await this.waitForElement(locator);
    await locator.selectOption(value);
  }

  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }

  async verifyText(locator: Locator, expectedText: string, description: string): Promise<void> {
    Logger.info(`Verifying ${description} contains: ${expectedText}`);
    await expect(locator).toContainText(expectedText);
  }

  async verifyElementVisible(locator: Locator, description: string): Promise<void> {
    Logger.info(`Verifying ${description} is visible`);
    await expect(locator).toBeVisible();
  }

  async verifyElementNotVisible(locator: Locator, description: string): Promise<void> {
    Logger.info(`Verifying ${description} is not visible`);
    await expect(locator).not.toBeVisible();
  }

  async verifyTitleText(expectedText: string, description: string): Promise<void> {
    Logger.info(`Verifying title contains: ${expectedText}`);
    const titleLocator = this.page.locator(`h1.title:has-text("${expectedText}")`);
    await this.verifyElementVisible(titleLocator, description);
  }

  async clickElementWithFallback(locator: Locator, fallbackLocator: Locator, description: string): Promise<void> {
    Logger.info(`Clicking: ${description} with fallback`);
    try {
      // try first locator
      await this.waitForElement(locator);
      await locator.click();
    } catch (error) {
      Logger.info(`Primary locator failed, trying fallback for: ${description}`);
      // if first locator failed, try fallback locator
      await this.waitForElement(fallbackLocator);
      await fallbackLocator.click();
    }
  }

  async clickFirstMatchingElement(locators: Locator[], description: string): Promise<void> {
    Logger.info(`Clicking first matching element: ${description}`);
    for (let i = 0; i < locators.length; i++) {
      try {
        await this.waitForElement(locators[i]);
        await locators[i].click();
        Logger.info(`Successfully clicked element ${i + 1} for: ${description}`);
        return;
      } catch (error) {
        Logger.info(`Element ${i + 1} failed for: ${description}, trying next...`);
        if (i === locators.length - 1) {
          throw new Error(`All ${locators.length} locators failed for: ${description}`);
        }
      }
    }
  }

  async clickWithRetryAndCheck(locator: Locator, successCheckLocator: Locator, description: string, maxRetries: number = 3, retryDelay: number = 1000): Promise<void> {
    Logger.info(`Clicking with retry and success check: ${description}`);
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        Logger.info(`Click attempt ${attempt}/${maxRetries} for: ${description}`);
        await this.waitForElement(locator);
        
        await locator.click();
        Logger.info(`Clicked: ${description} on attempt ${attempt}`);
        await this.page.waitForTimeout(1000);
        const isSuccessVisible = await successCheckLocator.isVisible();
        
        if (isSuccessVisible) {
          Logger.info(`Click successful - success condition met on attempt ${attempt}`);
          return; // success, success check element is visible
        } else {
          Logger.warn(`Success condition not met after click on attempt ${attempt}, will retry`);
          
          if (attempt < maxRetries) {
            Logger.info(`Waiting ${retryDelay}ms before retry...`);
            await this.page.waitForTimeout(retryDelay);
          } else {
            throw new Error(`Click failed after ${maxRetries} attempts - success condition never met for ${description}`);
          }
        }
      } catch (error) {
        Logger.error(`Click attempt ${attempt} failed with error: ${error}`);
        if (attempt === maxRetries) {
          throw new Error(`Click failed after ${maxRetries} attempts for ${description}: ${error}`);
        }
        await this.page.waitForTimeout(retryDelay);
      }
    }
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }
} 