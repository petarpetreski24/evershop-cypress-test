describe('Session Management Security Tests', () => {
  it('should invalidate session after logout for admin', () => {
    cy.visit("/admin/login");
    cy.get('input[name="email"]').type('admin@evershop.io');
    cy.get('input[name="password"]').type('12345678');

    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);

    cy.visit('/admin');
    cy.get('.first-letter').click();
    cy.intercept('Get', '/admin/user/logout').as('logout');
    cy.get('.text-critical').click();
    cy.wait('@logout').its('response.statusCode').should('eq', 304);

    cy.visit('/admin');
    cy.url().should('include', '/login');
  });

  it('should invalidate session after logout for user', () => {
    cy.visit('/account/login');
    cy.get(':nth-child(1) > .field-wrapper > input').type("demo@evershop.io");
    cy.get(':nth-child(2) > .field-wrapper > input').type("123456");

    cy.intercept('Post', '/customer/login').as('login');
    cy.realPress('Enter');
    cy.wait('@login').its('response.statusCode').should('eq', 200);

    cy.visit('/account');
    cy.intercept('Get', '/customer/logout').as('logout');
    cy.get('.border-b > .text-interactive').click();
    cy.wait('@logout').its('response.statusCode').should('eq', 304);

    cy.visit('/account');
    cy.url().should('include', '/login');
  })
});