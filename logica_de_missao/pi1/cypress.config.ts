import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' || browser.name === 'edge') {
          // Add command-line arguments for more robust disabling
          launchOptions.args.push('--disable-features=PasswordLeakDetection,AutofillServerCommunication');
          launchOptions.args.push('--disable-component-update');
          launchOptions.args.push('--no-default-browser-check');

          // Overwrite preferences with a more comprehensive set
          launchOptions.preferences.default = {
            ...launchOptions.preferences.default,
            'credentials_enable_service': false,
            'profile.password_manager_enabled': false,
            'profile.password_manager_leak_detection_enabled': false,
            'autofill.profile_enabled': false,
            'autofill.credit_card_enabled': false,
          };
        }
        return launchOptions;
      });
    },
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
  },
});
