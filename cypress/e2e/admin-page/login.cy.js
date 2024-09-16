describe('Admin Login Page', () => {
  beforeEach(() => {
    cy.visit('/admin/login');
  });

  it('should accept a valid email address', () => {
    cy.get('input[name="email"]').type('admin@evershop.io');
    cy.get('input[name="password"]').type('12345678');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });
});

describe('Admin Login Page - Invalid Email Formats', () => {
  beforeEach(() => {
    cy.visit('/admin/login');
  });

  it('should display error for missing @ in email', () => {
    cy.get('input[name="email"]').type('admin.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email').should('be.visible');
  });

  it('should display error for multiple @ symbols', () => {
    cy.get('input[name="email"]').type('admin@@evershop.io');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email').should('be.visible');
  });

  it('should display error for invalid characters', () => {
    cy.get('input[name="email"]').type('admin@!evershop.io');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email').should('be.visible');
  });

  it('should display error for empty email field', () => {
    cy.get('input[name="password"]').type('12345678');
    cy.get('button[type="submit"]').click();
    cy.contains('This field can not be empty').should('be.visible');
  });
});

describe('Admin Login Page - Password Field', () => {
  beforeEach(() => {
    cy.visit('/admin/login');
  });

  it('should accept a valid password', () => {
    cy.get('input[name="email"]').type('admin@evershop.io');
    cy.get('input[name="password"]').type('12345678');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });

  it('should display error for incorrect password', () => {
    cy.get('input[name="email"]').type('admin@evershop.io');
    cy.get('input[name="password"]').type('wrongPassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('should display error for empty password field', () => {
    cy.get('input[name="email"]').type('admin@evershop.io');
    cy.get('button[type="submit"]').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should display error for incorrect password', () => {
    cy.get('input[name="email"]').type('admin@evershop.io');
    cy.get('input[name="password"]').type('wrongPassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('should hide password characters by default', () => {
    cy.get('input[name="password"]').type('12345678').should('have.attr', 'type', 'password');
  });
});

describe('Admin Login Page - Login Button', () => {
  beforeEach(() => {
    cy.visit('/admin/login');
  });

  it('should be enabled when all fields are valid', () => {
    cy.get('input[name="email"]').type('admin@evershop.io');
    cy.get('input[name="password"]').type('12345678');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should submit the form on button click', () => {
    cy.get('input[name="email"]').type('admin@evershop.io');
    cy.get('input[name="password"]').type('12345678');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });
});

describe('Admin Login Page - Error Handling', () => {
  beforeEach(() => {
    cy.visit('/admin/login');
  });

  it('should display error for invalid credentials', () => {
    cy.get('input[name="email"]').type('admin@evershop.io');
    cy.get('input[name="password"]').type('invalidPassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email or password').should('be.visible');
  });
});

describe('Login Page - Usability', () => {
  beforeEach(() => {
    cy.visit('/admin/login');
  });

  it('should navigate through inputs with tab key', () => {
    cy.get('input[name="email"]').focus();
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'name', 'password');
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'type', 'submit');
  });
});