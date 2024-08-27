describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should accept a valid email address', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('validPassword123');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });
});

describe('Login Page - Invalid Email Formats', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should display error for missing @ in email', () => {
    cy.get('input[name="email"]').type('userexample.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email').should('be.visible');
  });

  it('should display error for multiple @ symbols', () => {
    cy.get('input[name="email"]').type('user@@example.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email format').should('be.visible');
  });

  it('should display error for invalid characters', () => {
    cy.get('input[name="email"]').type('user@!example.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email format').should('be.visible');
  });

  it('should display error for empty email field', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Email is required').should('be.visible');
  });
});

describe('Login Page - Password Field', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should accept a valid password', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('validPassword123');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });

  it('should display error for incorrect password', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('wrongPassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Incorrect password').should('be.visible');
  });

  it('should display error for empty password field', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Password is required').should('be.visible');
  });

  it('should hide password characters by default', () => {
    cy.get('input[name="password"]').type('password123').should('have.attr', 'type', 'password');
  });

  it('should show password when "show password" checkbox is checked', () => {
    cy.get('input[name="password"]').type('password123');
    cy.get('input[type="checkbox"]').check();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
  });
});

describe('Login Page - Login Button', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should be disabled when fields are empty', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should be enabled when all fields are valid', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('validPassword123');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should submit the form on button click', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('validPassword123');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });
});

describe('Login Page - Error Handling', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should display error for invalid credentials', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('invalidPassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('should display error for blocked account', () => {
    cy.get('input[name="email"]').type('blockeduser@example.com');
    cy.get('input[name="password"]').type('validPassword123');
    cy.get('button[type="submit"]').click();
    cy.contains('Your account is blocked').should('be.visible');
  });
});

describe('Forgot Password Functionality', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should show the "Forgot Password" link', () => {
    cy.contains('Forgot Password').should('be.visible');
  });

  it('should navigate to forgot password page on link click', () => {
    cy.contains('Forgot Password').click();
    cy.url().should('include', '/forgot-password');
  });

  it('should validate email on forgot password page', () => {
    cy.contains('Forgot Password').click();
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Password reset email sent').should('be.visible');
  });

  it('should display error for invalid email on forgot password page', () => {
    cy.contains('Forgot Password').click();
    cy.get('input[name="email"]').type('invalidemail');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email format').should('be.visible');
  });
});

describe('Account Creation Link', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should show the "Create an Account" link', () => {
    cy.contains('Create an Account').should('be.visible');
  });

  it('should navigate to account creation page on link click', () => {
    cy.contains('Create an Account').click();
    cy.url().should('include', '/create-account');
  });
});

describe('Login Page - Usability', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should navigate through inputs with tab key', () => {
    cy.focused().tab().should('have.attr', 'name', 'email');
    cy.focused().tab().should('have.attr', 'name', 'password');
    cy.focused().tab().should('have.attr', 'type', 'submit');
  });

  it('should display correctly on mobile devices', () => {
    cy.viewport('iphone-6');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });
});

describe('Login Page - Accessibility', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should be accessible by screen readers', () => {
    cy.injectAxe();
    cy.checkA11y();
  });

  it('should be navigable with keyboard only', () => {
    cy.focused().type('{tab}').should('have.attr', 'name', 'email');
    cy.focused().type('{tab}').should('have.attr', 'name', 'password');
    cy.focused().type('{tab}').should('have.attr', 'type', 'submit');
  });
});

