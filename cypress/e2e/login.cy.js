describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should accept a valid email address', () => {
    cy.get('input[name="email"]').type('demo@evershop.io');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });
});

describe('Login Page - Invalid Email Formats', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should display error for missing @ in email', () => {
    cy.get('input[name="email"]').type('demo.com');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email').should('be.visible');
  });

  it('should display error for multiple @ symbols', () => {
    cy.get('input[name="email"]').type('demo@@evershop.io');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email').should('be.visible');
  });

  it('should display error for invalid characters', () => {
    cy.get('input[name="email"]').type('demo@!evershop.io');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email').should('be.visible');
  });

  it('should display error for empty email field', () => {
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    cy.contains('This field can not be empty').should('be.visible');
  });
});

describe('Login Page - Password Field', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should accept a valid password', () => {
    cy.get('input[name="email"]').type('demo@evershop.io');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });

  it('should display error for incorrect password', () => {
    cy.get('input[name="email"]').type('demo@evershop.io');
    cy.get('input[name="password"]').type('wrongPassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('should display error for empty password field', () => {
    cy.get('input[name="email"]').type('demo@evershop.io');
    cy.get('button[type="submit"]').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should display error for incorrect password', () => {
    cy.get('input[name="email"]').type('demo@evershop.io');
    cy.get('input[name="password"]').type('wrongPassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('should hide password characters by default', () => {
    cy.get('input[name="password"]').type('123456').should('have.attr', 'type', 'password');
  });

  it('should show password when "show password" checkbox is checked', () => {
    cy.get('input[name="password"]').type('123456');
    cy.get('input[type="checkbox"]').check();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
  });
  //This test will fail because it doesn't have that functionality
});

describe('Login Page - Login Button', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should be disabled when fields are empty', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });
  //This test will fail because it doesn't have that functionality

  it('should be enabled when all fields are valid', () => {
    cy.get('input[name="email"]').type('demo@evershop.io');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should submit the form on button click', () => {
    cy.get('input[name="email"]').type('demo@evershop.io');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });
});

describe('Login Page - Error Handling', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should display error for invalid credentials', () => {
    cy.get('input[name="email"]').type('demo@evershop.io');
    cy.get('input[name="password"]').type('invalidPassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email or password').should('be.visible');
  });

  // it('should display error for disabled account', () => {
  //   cy.get('input[name="email"]').type('disableduser@evershop.io');
  //   cy.get('input[name="password"]').type('123456');
  //   cy.get('button[type="submit"]').click();
  //   cy.contains('Your account is disabled').should('be.visible');
  // });
});

describe('Forgot Password Functionality', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should show the "Forgot Password" link', () => {
    cy.contains('Forgot your password?').should('be.visible');
  });

  it('should navigate to forgot password page on link click', () => {
    cy.contains('Forgot your password?').click();
    cy.url().should('include', '/reset-password');
  });

  it('should validate email on forgot password page', () => {
    cy.contains('Forgot your password?').click();
    cy.get('input[name="email"]').type('demo@evershop.io');
    cy.get('button[type="submit"]').click();
    cy.contains('We have sent you an email with a link to reset your password. Please check your inbox.').should('be.visible');
  });

  it('should display error for invalid email on forgot password page', () => {
    cy.contains('Forgot your password?').click();
    cy.get('input[name="email"]').type('demo@@evershop.io');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email').should('be.visible');
  });

  it('should display error for for empty email field on forgot password page', () => {
    cy.contains('Forgot your password?').click();
    cy.get('button[type="submit"]').click();
    cy.contains('This field can not be empty').should('be.visible');
  });
});

describe('Account Creation Link Validation', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should show the "Create an Account" link', () => {
    cy.contains('Create an account').should('be.visible');
  });

  it('should navigate to account creation page on link click', () => {
    cy.contains('Create an account').click();
    cy.url().should('include', '/register');
  });
});

describe('Account Creation Form Validation', () => {
  const validEmail = `demo${Math.floor(Math.random() * 1000000)}@evershop.io`;
  const validPassword = '123456';

  beforeEach(() => {
    cy.visit('/account/register');
  });

  it('should show error for empty full name', () => {
    cy.get('input[name="email"]').type(validEmail);
    cy.get('input[name="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();
    
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should show error for empty email', () => {
    cy.get('input[name="full_name"]').type('User User');
    cy.get('input[name="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();
    
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should show error for empty password', () => {
    cy.get('input[name="full_name"]').type('User User');
    cy.get('input[name="email"]').type(validEmail);
    cy.get('button[type="submit"]').click();
    
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should show error for whitespace in email', () => {
    cy.get('input[name="full_name"]').type('User User');
    cy.get('input[name="email"]').type('   ');
    cy.get('input[name="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();
    
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should show error for invalid email format', () => {
    cy.get('input[name="full_name"]').type('User User');
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();
    
    cy.contains('Invalid email').should('be.visible');
  });

  it('should show error for invalid password format', () => {
    cy.get('input[name="full_name"]').type('John Doe');
    cy.get('input[name="email"]').type(validEmail);
    cy.get('input[name="password"]').type('123'); // invalid password
    cy.get('button[type="submit"]').click();
    
    cy.contains('Password is invalid: Password must be at least 6 characters').should('be.visible');
  });

  it('should successfully create an account with valid data', () => {
    cy.get('input[name="full_name"]').type('John Doe');
    cy.get('input[name="email"]').type(validEmail);
    cy.get('input[name="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();
    
    cy.url().should('not.include', '/account/register');
    cy.contains('Discount 20% For All Orders').should('be.visible');
  });

  it('should show error for already registered email', () => {
    cy.get('input[name="full_name"]').type('User User');
    cy.get('input[name="email"]').type(validEmail);
    cy.get('input[name="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();
    
    cy.contains('Email is already used').should('be.visible');
  });

  it('should show error for whitespace in password', () => {
    cy.get('input[name="full_name"]').type('User User');
    cy.get('input[name="email"]').type(validEmail);
    cy.get('input[name="password"]').type('       ');
    cy.get('button[type="submit"]').click();
    
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should show error for whitespace in full name', () => {
    cy.get('input[name="full_name"]').type('   ');
    cy.get('input[name="email"]').type(validEmail);
    cy.get('input[name="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();
    
    cy.contains('This field can not be empty').should('be.visible');
  });
});

describe('Login Page - Usability', () => {
  beforeEach(() => {
    cy.visit('/account/login');
  });

  it('should navigate through inputs with tab key', () => {
    cy.get('input[name="email"]').focus();
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'name', 'password');
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'type', 'submit');
  });
});


