describe('SQL Injection tests', () => {
  it('should not allow an SQL injection in the search tab', () => {
    cy.visit('/');
    cy.get('div.search-box').click();
    cy.get('div.search-input').find('input').type("SELECT * FROM users WHERE username = 'admin'--' AND password = ''");
    cy.realPress('Enter');
    cy.contains('There is no product to display').should('be.visible');
  })

  it('should not allow an SQL injection in the login tab via email', () => {
    cy.visit('/account/login');
    cy.get(':nth-child(1) > .field-wrapper > input').type("SELECT * FROM users WHERE username = 'admin'--' AND password = ''");
    cy.realPress('Enter');
    cy.contains('Invalid email').should('be.visible');
  })

  it('should not allow an SQL injection in the login tab via password', () => {
    cy.visit('/account/login');
    cy.get(':nth-child(1) > .field-wrapper > input').type("a@a.com");
    cy.get(':nth-child(2) > .field-wrapper > input').type("SELECT * FROM users WHERE username = 'admin'--' AND password = ''");
    cy.realPress('Enter');
    cy.contains('Invalid email or password').should('be.visible');
  })

  it('should not allow an SQL injection in the login tab via email', () => {
    cy.visit('/account/register');
    cy.get(':nth-child(1) > .field-wrapper > input').type("NAME");
    cy.get(':nth-child(2) > .field-wrapper > input').type("SELECT * FROM users WHERE username = 'admin'--' AND password = ''");
    cy.get(':nth-child(3) > .field-wrapper > input').type("123456");
    cy.realPress('Enter');
    cy.contains('Invalid email').should('be.visible');
  })

  it('should not allow an SQL injection in the admin login tab via email', () => {
    cy.visit('/admin/login');
    cy.get('#adminLoginForm > :nth-child(1) > .field-wrapper > input').type("SELECT * FROM users WHERE username = 'admin'--' AND password = ''");
    cy.get('#adminLoginForm > :nth-child(2) > .field-wrapper > input').type("123456");
    cy.realPress('Enter');
    cy.contains('Invalid email').should('be.visible');
  })
})