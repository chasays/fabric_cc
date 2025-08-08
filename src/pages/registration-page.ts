import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { User } from '../types';
import { Logger } from '../utils/logger';
import { DataGenerator } from '../utils/data-generator';

export class RegistrationPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly phoneNumberInput: Locator;
  private readonly ssnInput: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly registerButton: Locator;
  private readonly successMessage: Locator;
  private readonly successMessageMore: Locator;
  private readonly usernameError: Locator;

  constructor(page: Page) {
    super(page, '/parabank/register.htm');
    this.firstNameInput = page.locator('input[id="customer.firstName"]');
    this.lastNameInput = page.locator('input[id="customer.lastName"]');
    this.addressInput = page.locator('input[id="customer.address.street"]');
    this.cityInput = page.locator('input[id="customer.address.city"]');
    this.stateInput = page.locator('input[id="customer.address.state"]');
    this.zipCodeInput = page.locator('input[id="customer.address.zipCode"]');
    this.phoneNumberInput = page.locator('input[id="customer.phoneNumber"]');
    this.ssnInput = page.locator('input[id="customer.ssn"]');
    this.usernameInput = page.locator('input[id="customer.username"]');
    this.passwordInput = page.locator('input[id="customer.password"]');
    this.confirmPasswordInput = page.locator('input[id="repeatedPassword"]');
    this.registerButton = page.locator('input[value="Register"]');
    this.successMessage = page.locator('#rightPanel h1');
    this.successMessageMore = page.locator('#rightPanel p');
    this.usernameError = page.locator('span:has-text("This username already exists.")');
  }

  async registerUser(user: User): Promise<void> {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        Logger.info(`Registration attempt ${attempt}/${maxRetries} for user: ${user.username}`);
        
        // Fill all user information
        await this.fillElement(this.firstNameInput, user.firstName, 'First Name');
        await this.fillElement(this.lastNameInput, user.lastName, 'Last Name');
        await this.fillElement(this.addressInput, user.address, 'Address');
        await this.fillElement(this.cityInput, user.city, 'City');
        await this.fillElement(this.stateInput, user.state, 'State');
        await this.fillElement(this.zipCodeInput, user.zipCode, 'Zip Code');
        await this.fillElement(this.phoneNumberInput, user.phoneNumber, 'Phone Number');
        await this.fillElement(this.ssnInput, user.ssn, 'SSN');
        await this.fillElement(this.usernameInput, user.username, 'Username');
        await this.fillElement(this.passwordInput, user.password, 'Password');
        await this.fillElement(this.confirmPasswordInput, user.password, 'Confirm Password');
        
        // Click register button
        await this.clickElement(this.registerButton, 'Register button');
        
        // Wait a moment for the page to process
        await this.page.waitForTimeout(2000);
        
        // Check if username already exists error appears
        const isUsernameError = await this.usernameError.isVisible();
        
        if (isUsernameError) {
          Logger.info(`Username ${user.username} already exists, generating new username`);
          
          if (attempt < maxRetries) {
            // Generate new username and update user object
            user = DataGenerator.generateUser();
            Logger.info(`New username generated: ${user.username}`);
            
            // Clear only the username field for retry
            await this.usernameInput.clear();
            
            // Wait before retry
            await this.page.waitForTimeout(retryDelay);
          } else {
            throw new Error(`Registration failed after ${maxRetries} attempts - username conflict`);
          }
        } else {
          // No username error, check if registration was successful
          try {
            await this.verifyRegistrationSuccess();
            Logger.info(`Registration successful on attempt ${attempt}`);
            return;
          } catch (error) {
            Logger.error(`Registration verification failed on attempt ${attempt}: ${error}`);
            if (attempt === maxRetries) {
              throw error;
            }
          }
        }
      } catch (error) {
        Logger.error(`Registration attempt ${attempt} failed with error: ${error}`);
        if (attempt === maxRetries) {
          throw new Error(`Registration failed after ${maxRetries} attempts: ${error}`);
        }
        await this.page.waitForTimeout(retryDelay);
      }
    }
    
    throw new Error(`Registration failed after ${maxRetries} attempts`);
  }

  async verifyRegistrationSuccess(): Promise<void> {
    // add more checkpoints
    await this.verifyText(this.successMessage, 'Welcome ', 'Registration success message');
    await this.verifyText(this.successMessageMore, 'Your account was created successfully. You are now logged in.', 'Registration success message more');
  }

  async isUsernameErrorVisible(): Promise<boolean> {
    return await this.usernameError.isVisible();
  }

  async clearUsernameField(): Promise<void> {
    await this.usernameInput.clear();
  }
} 