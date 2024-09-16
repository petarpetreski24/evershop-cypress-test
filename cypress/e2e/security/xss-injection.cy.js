describe('XSS Injection tests', () => {
  it('should not allow an XSS injection in the search tab', () => {
    cy.visit('/');
    cy.get('div.search-box').click();
    cy.get('div.search-input').find('input').type("<script>alert('XSS')</script>");
    cy.realPress('Enter');
    cy.on('window:alert', (str) => {
      expect(str).to.not.equal('XSS');
    });
  })

  it('should not allow an XSS injection in the login tab via email', () => {
    cy.visit('/account/login');
    cy.get(':nth-child(1) > .field-wrapper > input').type("<script>alert('XSS')</script>");
    cy.realPress('Enter');
    cy.on('window:alert', (str) => {
      expect(str).to.not.equal('XSS');
    });
  })

  it('should not allow an XSS injection in the login tab via password', () => {
    cy.visit('/account/login');
    cy.get(':nth-child(1) > .field-wrapper > input').type("a@a.com");
    cy.get(':nth-child(2) > .field-wrapper > input').type("<script>alert('XSS')</script>");
    cy.realPress('Enter');
    cy.on('window:alert', (str) => {
      expect(str).to.not.equal('XSS');
    });
  })

  it('should not allow an XSS injection in the login tab via email', () => {
    cy.visit('/account/register');
    cy.get(':nth-child(1) > .field-wrapper > input').type("NAME");
    cy.get(':nth-child(2) > .field-wrapper > input').type("<script>alert('XSS')</script>");
    cy.get(':nth-child(3) > .field-wrapper > input').type("123456");
    cy.realPress('Enter');
    cy.on('window:alert', (str) => {
      expect(str).to.not.equal('XSS');
    });
  })

  it('should not allow an XSS injection in the admin login tab via email', () => {
    cy.visit('/admin/login');
    cy.get('#adminLoginForm > :nth-child(1) > .field-wrapper > input').type("<script>alert('XSS')</script>");
    cy.get('#adminLoginForm > :nth-child(2) > .field-wrapper > input').type("123456");
    cy.realPress('Enter');
    cy.on('window:alert', (str) => {
      expect(str).to.not.equal('XSS');
    });
  })
})