function admin_login() {
  cy.visit("/admin/login");
  cy.get('input[name="email"]').type('admin@evershop.io');
  cy.get('input[name="password"]').type('12345678');
}

describe('Admin Coupons - Add New Coupon', () => {
  beforeEach(() => {
    admin_login();
    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.visit('/admin/coupons');
  });

  it('should successfully open the page for creating new categories', () => {
    cy.get('.button').click()
    cy.url().should('include', '/new');
  });

  it('should display an error message for required code', () => {
    cy.get('.button').click()
    cy.get('#description').type("Description for coupon20.");
    cy.get('.grid > :nth-child(1) > .form-field-container > .field-wrapper > input').type("20");
    cy.get(':nth-child(2) > .flex > .radio-unchecked').click();
    cy.get('.primary').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should display an error message for required description', () => {
    cy.get('.button').click()
    cy.get('#couponForm > :nth-child(1) > :nth-child(1) > .card-section > .card-session-content > :nth-child(1) > :nth-child(1) > .field-wrapper > input').type("COUPON20");
    cy.get('.grid > :nth-child(1) > .form-field-container > .field-wrapper > input').type("20");
    cy.get(':nth-child(2) > .flex > .radio-unchecked').click();
    cy.get('.primary').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should display an error message for required amount', () => {
    cy.get('.button').click()
    cy.get('#couponForm > :nth-child(1) > :nth-child(1) > .card-section > .card-session-content > :nth-child(1) > :nth-child(1) > .field-wrapper > input').type("COUPON20");
    cy.get('#description').type("Description for coupon20.");
    cy.get(':nth-child(2) > .flex > .radio-unchecked').click();
    cy.get('.primary').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should display an error message for required type', () => {
    cy.get('.button').click()
    cy.get('#couponForm > :nth-child(1) > :nth-child(1) > .card-section > .card-session-content > :nth-child(1) > :nth-child(1) > .field-wrapper > input').type("COUPON20");
    cy.get('#description').type("Description for coupon20.");
    cy.get('.grid > :nth-child(1) > .form-field-container > .field-wrapper > input').type("20");
    cy.get('.primary').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should successfully create a new coupon', () => {
    cy.get('.button').click()
    cy.get('#couponForm > :nth-child(1) > :nth-child(1) > .card-section > .card-session-content > :nth-child(1) > :nth-child(1) > .field-wrapper > input').type("COUPON20");
    cy.get('#description').type("Description for coupon20.");
    cy.get('.grid > :nth-child(1) > .form-field-container > .field-wrapper > input').type("20");
    cy.get(':nth-child(2) > .flex > .radio-unchecked').click();
    cy.get('.primary').click();
    cy.wait(5000);

    cy.intercept('Get', '/admin/coupons').as('coupons');
    cy.visit('/admin/coupons');
    cy.wait('@coupons').its('response.statusCode').should('eq', 200);

    cy.get('.listing')
      .find('a')
      .contains("COUPON20");
  });
});

describe('Admin Coupons Page', () => {
  beforeEach(() => {
    admin_login();
    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.visit('/admin/coupons');
  });

  it('should display featured coupons with correct details', () => {
    cy.get('.listing')
      .find('a')
      .contains("COUPON20");
  });

  it('should display certain categories based on user input', () => {
    cy.get('#coupon').type('COU{enter}');
    cy.get('.listing')
      .find('a')
      .contains("COUPON20");
  });

  it('should display all categories after the search filter is cleared', () => {
      cy.get('#coupon').type('kid{enter}');
      cy.findByText('Clear filter').click();
      cy.get('.listing')
        .find('a')
        .contains("COUPON20");
  });
});


describe('Admin Coupons - Edit Page', () => {
  beforeEach(() => {
    admin_login();
    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.visit('/admin/coupons');
  });

  it('should display the edit page for a certain coupon', () => {
    cy.get('.listing')
      .find('a')
      .contains('COUPON20')
      .click();
    cy.url().should('include', '/edit');
  });

  it('should successfully edit a coupon', () => {
    cy.get('.listing')
      .find('a')
      .contains('COUPON20')
      .click();

    cy.get('#couponForm > :nth-child(1) > :nth-child(1) > .card-section > .card-session-content > :nth-child(1) > :nth-child(1) > .field-wrapper > input').type("0");
    cy.findByText('Save').click();

    cy.intercept('Get', '/admin/coupons').as('coupons');
    cy.get('.breadcrum-icon > .flex').click();
    cy.wait('@coupons').its('response.statusCode').should('eq', 200);

    cy.get('.listing')
      .find('a')
      .contains("COUPON200");
  });

  it('should delete a coupon', () => {
    cy.contains('tr', "COUPON200")
      .find('td')
      .first()
      .click();
    cy.findByText('Delete').click();
    cy.get('.critical > span').click();

    cy.get('.listing')
      .should('not.contain', "COUPON200");
  });
});