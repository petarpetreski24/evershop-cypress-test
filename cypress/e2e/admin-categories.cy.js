function admin_login() {
  cy.visit("/admin/login");
  cy.get('input[name="email"]').type('admin@evershop.io');
  cy.get('input[name="password"]').type('12345678');
}

const categories = [
  {name: "Men"},
  {name: "Women"},
  {name: "Kids"}
];

describe('Admin Categories Page', () => {
  beforeEach(() => {
    admin_login();
    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.visit('/admin/categories');
  });

  it('should display featured categories with correct details', () => {
    categories.forEach((category) => {
      cy.get('.listing')
      .find('a')
      .contains(category.name);
    });
  });

  it('should display certain categories based on user input', () => {
    cy.get('input[id="name"]').type('kid{enter}');
    cy.get('.listing')
      .find('a')
      .contains("Kids");
  });

  it('should display all categories after the search filter is cleared', () => {
      cy.get('input[id="name"]').type('kid{enter}');
      cy.findByText('Clear filter').click();
      categories.forEach((category) => {
        cy.get('.listing')
        .find('a')
        .contains(category.name);
      });
  });
});

describe('Admin Categories - Edit Page', () => {
  beforeEach(() => {
    admin_login();
    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.visit('/admin/categories');
  });

  it('should display the edit page for a certain category', () => {
    cy.get('.listing')
      .find('a')
      .contains('Men')
      .click();
    cy.url().should('include', '/edit');
  });

  it('should successfully edit a category', () => {
    cy.get('.listing')
      .find('a')
      .contains('Men')
      .click();

    cy.get('input[id="name"]').type("'s");
    cy.findByText('Save').click();

    cy.intercept('Get', '/admin/categories').as('categories');
    cy.get('.breadcrum-icon > .flex').click();
    cy.wait('@categories').its('response.statusCode').should('eq', 200);

    cy.get('.listing')
      .find('a')
      .contains("Men's");
  });

  it('should delete a category', () => {
    cy.contains('tr', "Men's")
      .find('td')
      .first()
      .click();
    cy.findByText('Delete').click();
    cy.get('.critical > span').click();

    cy.get('.listing')
      .find('a')
      .should('not.contain', "Men's");
  });
});

describe('Admin Categories - Add New Category', () => {
  beforeEach(() => {
    admin_login();
    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.visit('/admin/categories');
  });

  it('should successfully open the page for creating new categories', () => {
    cy.get('.button').click()
    cy.url().should('include', '/new');
  });

  it('should display an error message for required name', () => {
    cy.get('.button').click()
    cy.get('#urlKey').type('men');
    cy.get('.primary > span').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should display an error message for required url key', () => {
    cy.get('.button').click()
    cy.get('#name').type('Men');
    cy.get('.primary > span').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should successfully create a new category', () => {
    cy.get('.button').click()
    cy.get('#urlKey').type('men');
    cy.get('#name').type('Men');
    cy.get('.primary > span').click();

    cy.intercept('Get', '/admin/categories').as('categories');
    cy.visit('/admin/categories');
    cy.wait('@categories').its('response.statusCode').should('eq', 200);

    categories.forEach((category) => {
      cy.get('.listing')
        .find('a')
        .contains(category.name);
    });
  });
})