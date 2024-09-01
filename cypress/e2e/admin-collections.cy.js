function admin_login() {
  cy.visit("/admin/login");
  cy.get('input[name="email"]').type('admin@evershop.io');
  cy.get('input[name="password"]').type('12345678');
}

const collections = [
  {name: "Featured Products", code: "homepage"}
];

describe('Admin Collections Page', () => {
  beforeEach(() => {
    admin_login();
    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.visit('/admin/collections');
  });

  it('should display featured collections with correct details', () => {
    collections.forEach((collection) => {
      cy.get('.listing')
        .find('a')
        .contains(collection.name);

      cy.get('.listing')
        .find('td')
        .contains(collection.code);
    });
  });

  it('should display certain collections based on user input', () => {
    cy.get('input[id="name"]').type('feat{enter}');
    cy.get('.listing')
      .find('a')
      .contains("Featured Products");
  });

  it('should display all collections after the search filter is cleared', () => {
      cy.get('input[id="name"]').type('feat{enter}');
      cy.findByText('Clear filter').click();
      collections.forEach((collection) => {
        cy.get('.listing')
          .find('a')
          .contains(collection.name);
      });
  });
});

describe('Admin Collections - Add New Collection', () => {
  beforeEach(() => {
    admin_login();
    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.visit('/admin/collections');
  });

  it('should successfully open the page for creating new collections', () => {
    cy.get('.button').click()
    cy.url().should('include', '/new');
  });

  it('should display an error message for required name', () => {
    cy.get('.button').click()
    cy.get('#code').type('winter');
    cy.get('.primary > span').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should display an error message for required url key', () => {
    cy.get('.button').click()
    cy.get('#name').type('Winter Collection');
    cy.get('.primary > span').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should successfully create a new category', () => {
    cy.get('.button').click()
    cy.get('#code').type('winter');
    cy.get('#name').type('Winter Collection');
    cy.get('.primary > span').click();

    cy.intercept('Get', '/admin/collections').as('collections');
    cy.visit('/admin/collections');
    cy.wait('@collections').its('response.statusCode').should('eq', 200);

    collections.forEach((collection) => {
      cy.get('.listing')
        .find('a')
        .contains(collection.name);
    });
  });
})

describe('Admin Collections - Edit Page', () => {
  beforeEach(() => {
    admin_login();
    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.visit('/admin/collections');
  });

  it('should display the edit page for a certain collection', () => {
    cy.get('.listing')
      .find('a')
      .contains('Winter Collection')
      .click();
    cy.url().should('include', '/edit');
  });

  it('should successfully edit a collection', () => {
    cy.get('.listing')
      .find('a')
      .contains('Winter Collection')
      .click();

    cy.get('input[id="name"]').type(" new");
    cy.findByText('Save').click();

    cy.intercept('Get', '/admin/collections').as('collections');
    cy.get('.breadcrum-icon > .flex').click();
    cy.wait('@collections').its('response.statusCode').should('eq', 200);

    cy.get('.listing')
      .find('a')
      .contains("Winter Collection new");
  });

  it('should add a product to a collection', () => {
    cy.get('.listing')
      .find('a')
      .contains('Winter Collection')
      .click();

    cy.findByText('Add products').click();
    cy.get(':nth-child(1) > .col-span-2 > .button').click();
    cy.get('.card-session-content > .justify-between > .button').click();
    cy.findByText('Save').click();

    cy.get('.justify-between > :nth-child(1) > i').invoke('text').should('eq', '1 items');
  });

  it('should remove a product from a collection', () => {
    cy.get('.listing')
      .find('a')
      .contains('Winter Collection')
      .click();

    cy.findByText('Remove').click();
    cy.findByText('Save').click();

    cy.get('.justify-between > :nth-child(1) > i').invoke('text').should('eq', '0 items');
  });

  it('should delete a collection', () => {
    cy.contains('tr', "Winter Collection new")
      .find('td')
      .first()
      .click();
    cy.findByText('Delete').click();
    cy.get('.critical > span').click();

    cy.get('.listing')
      .find('a')
      .should('not.contain', "Winter Collection new");
  });
});