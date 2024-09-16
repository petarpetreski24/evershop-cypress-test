const pages = [
  '/admin',
  '/admin/products/new',
  '/admin/coupon/new',
  '/admin/products',
  '/admin/categories',
  '/admin/collections',
  '/admin/attributes',
  '/admin/orders',
  '/admin/customers',
  '/admin/coupons',
  '/admin/pages'
  ];

describe('Loading pages tests', () => {

  it('Should load each of the pages in less than 2 seconds', () => {
    cy.visit("/admin/login");
    cy.get('input[name="email"]').type('admin@evershop.io');
    cy.get('input[name="password"]').type('12345678');

    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);

    pages.forEach((page) => {
      cy.visit(page);
      cy.window().then((win) => {
      const timing = win.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      cy.log(`Page '`+page+`' Load Time: ${pageLoadTime} ms`);

      expect(pageLoadTime).to.be.lessThan(2000);
    });
    });
  });
});