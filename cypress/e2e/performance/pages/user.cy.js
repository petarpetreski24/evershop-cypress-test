const pages = [
  '/',
  '/account/login',
  '/account/register',
  '/women',
  '/kids',
  '/men',
  '/cart',
  '/striped-cotton-sweater',
  '/checkout',
  '/admin'
  ];

describe('Loading pages tests', () => {
  it('Should load each of the pages in less than 2 seconds', () => {
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