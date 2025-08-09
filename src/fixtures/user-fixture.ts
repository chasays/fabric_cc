import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { RegistrationPage } from '../pages/registration-page';
import { HomePage } from '../pages/home-page';
import { DataGenerator } from '../utils/data-generator';
import { User } from '../types';

/**
 * User Fixtrues for Parabank Test Automation
 * 
 * This fixture provides reusable test components for user-related testing scenarios:
 * - loginPage: Pre-configured login page instance
 * - registrationPage: Pre-configured registration page instance  
 * - homePage: Pre-configured home page instance
 * - registeredUser: Automatically creates and registers a new user for testing
 * - authenticatedApiContext: Provides an authenticated API context for API testing
 * - todo add more fixtures: like setup user, teardown user, etc.
 * 
 * Usage:
 * ```typescript
 * test('user can login', async ({ loginPage, registeredUser }) => {
 *   await loginPage.login(registeredUser);
 *   // ... test logic real code ~~~
 * });
 * 
 * test('api test', async ({ authenticatedApiContext, registeredUser }) => {
 *   const api = authenticatedApiContext;
 *   // ... API test logic
 * });
 * ```
 */
type UserFixtures = {
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
  homePage: HomePage;
  registeredUser: User;
  authenticatedApiContext: {
    page: any;
    request: any;
    user: User;
  };
};

export const test = base.extend<UserFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page);
    await use(registrationPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  registeredUser: async ({ loginPage, registrationPage }, use) => {
    const user = DataGenerator.generateUser();
    
    // Navigate to registration page and create user
    await loginPage.navigate();
    await loginPage.clickRegisterLink();
    await registrationPage.registerUser(user);
    await registrationPage.verifyRegistrationSuccess();
    
    await use(user);
  },

  authenticatedApiContext: async ({ page, request, registeredUser, loginPage }, use) => {
    // Login the user to establish authentication context
    await loginPage.navigate();
    await loginPage.login(registeredUser);
    
    // Verify login was successful
    const isLoggedIn = await loginPage.isLoggedIn();
    if (!isLoggedIn) {
      throw new Error('Failed to authenticate user for API testing');
    }
    
    await use({
      page,
      request,
      user: registeredUser
    });
  }
});

export { expect } from '@playwright/test'; 