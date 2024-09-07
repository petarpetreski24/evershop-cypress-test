const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",  // Set the base URL for your tests
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
});
