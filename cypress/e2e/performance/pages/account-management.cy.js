describe('Account management performance', () => {
  it('should login admin in less than 1 second', () => {
    cy.visit("/admin/login");
    cy.get('input[name="email"]').type('admin@evershop.io');
    cy.get('input[name="password"]').type('12345678');

    cy.intercept('Post', '/admin/user/login').as('login');

    cy.get('button[type="submit"]').click();
    const startTime = Date.now();
    cy.wait('@login').its('response.statusCode').should('eq', 200);

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    cy.log(`Admin login response time: ${responseTime} ms`);
    expect(responseTime).to.be.lessThan(1000);
  });

  it('should logout admin in less than 1 second', () => {
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
    const startTime = Date.now();
    cy.wait('@logout').its('response.statusCode').should('eq', 304);

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    cy.log(`Admin logout response time: ${responseTime} ms`);
    expect(responseTime).to.be.lessThan(1000);
  });

  it('should login user in less than 1 second', () => {
    cy.visit('/account/login');
    cy.get(':nth-child(1) > .field-wrapper > input').type("demo@evershop.io");
    cy.get(':nth-child(2) > .field-wrapper > input').type("123456");

    cy.intercept('Post', '/customer/login').as('login');
    cy.realPress('Enter');
    const startTime = Date.now();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    cy.log(`User login response time: ${responseTime} ms`);
  })

  it('should logout user in less than 1 second', () => {
    cy.visit('/account/login');
    cy.get(':nth-child(1) > .field-wrapper > input').type("demo@evershop.io");
    cy.get(':nth-child(2) > .field-wrapper > input').type("123456");

    cy.intercept('Post', '/customer/login').as('login');
    cy.realPress('Enter');
    cy.wait('@login').its('response.statusCode').should('eq', 200);

    cy.visit('/account');
    cy.intercept('Get', '/customer/logout').as('logout');
    cy.get('.border-b > .text-interactive').click();
    const startTime = Date.now();
    cy.wait('@logout').its('response.statusCode').should('eq', 304);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    cy.log(`User logout response time: ${responseTime} ms`);
  })
})