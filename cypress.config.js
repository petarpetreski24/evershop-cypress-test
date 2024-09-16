const { defineConfig } = require("cypress");
const { lighthouse, prepareAudit } = require('cypress-audit');


module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",  // Set the base URL for your tests
    setupNodeEvents(on, config) {
      // implement node event listeners here
      //  on('before:browser:launch', (browser = {}, launchOptions) => {
      //   prepareAudit(launchOptions);
      //   return launchOptions;
      // });

      // Register the Lighthouse task
      on('task', {
        lighthouse: lighthouse(),
      });
    }
  }
});
