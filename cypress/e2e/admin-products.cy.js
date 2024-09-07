function admin_login() {
  cy.visit("/admin/login");
  cy.get('input[name="email"]').type('admin@evershop.io');
  cy.get('input[name="password"]').type('12345678');
}

const products = [
  {name: "Striped Cotton Sweater"},
  {name: "Denim Skinny Jeans"},
  {name: "Classic Leather Loafers"},
  {name: "Floral Maxi Dress"}
];

describe('Admin Products Page', () => {
  beforeEach(() => {
    admin_login();
    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.visit('/admin/products');
  });

  it('should display featured products with correct details', () => {
    products.forEach((product) => {
      cy.get('.listing')
      .find('a')
      .contains(product.name);
    });
  });

  it('should display certain products based on user input', () => {
    cy.get('#keyword').type('dress{enter}');
    cy.get('.listing')
      .find('a')
      .contains("Floral Maxi Dress");
  });

  it('should display all categories after the search filter is cleared', () => {
      cy.get('#keyword').type('dress{enter}');
      cy.findByText('Clear filter').click();
      products.forEach((product) => {
        cy.get('.listing')
        .find('a')
        .contains(product.name);
      });
  });
});

describe('Admin Products - Add New Product', () => {
  beforeEach(() => {
    admin_login();
    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.visit('/admin/products');
  });

  it('should successfully open the page for creating new products', () => {
    cy.get('.button').click()
    cy.url().should('include', '/new');
  });

  it('should display an error message for required name', () => {
    cy.get('.button').click()

    cy.get('#sku').type('WSN-500');
    cy.get('#price').type('500');
    cy.get('#weight').type('400');
    cy.get('#qty').type('100');
    cy.get('#urlKey').type('wsn-500');

    cy.get('.primary > span').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should display an error message for required SKU', () => {
    cy.get('.button').click()
    
    cy.get('#name').type('White Sneakers');
    cy.get('#price').type('500');
    cy.get('#weight').type('400');
    cy.get('#qty').type('100');
    cy.get('#urlKey').type('wsn-500');

    cy.get('.primary > span').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should display an error message for required price', () => {
    cy.get('.button').click()
    
    cy.get('#name').type('White Sneakers');
    cy.get('#sku').type('WSN-500');
    cy.get('#weight').type('400');
    cy.get('#qty').type('100');
    cy.get('#urlKey').type('wsn-500');

    cy.get('.primary > span').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should display an error message for required weight', () => {
    cy.get('.button').click()
    
    cy.get('#name').type('White Sneakers');
    cy.get('#sku').type('WSN-500');
    cy.get('#price').type('500');
    cy.get('#qty').type('100');
    cy.get('#urlKey').type('wsn-500');

    cy.get('.primary > span').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should display an error message for required quantity', () => {
    cy.get('.button').click()
    
    cy.get('#name').type('White Sneakers');
    cy.get('#sku').type('WSN-500');
    cy.get('#price').type('500');
    cy.get('#weight').type('400');
    cy.get('#urlKey').type('wsn-500');

    cy.get('.primary > span').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should display an error message for required url key', () => {
    cy.get('.button').click()
    
    cy.get('#name').type('White Sneakers');
    cy.get('#sku').type('WSN-500');
    cy.get('#price').type('500');
    cy.get('#weight').type('400');
    cy.get('#qty').type('100');

    cy.get('.primary > span').click();
    cy.contains('This field can not be empty').should('be.visible');
  });

  it('should successfully create a new product', () => {
    cy.get('.button').click()

    cy.get('#name').type('White Sneakers');
    cy.get('#sku').type('WSN-500');
    cy.get('#price').type('500');
    cy.get('#weight').type('400');
    cy.get('#qty').type('100');
    cy.get('#urlKey').type('wsn-500');

    cy.get('.primary > span').click();

    cy.intercept('Get', '/admin/products').as('products');
    cy.visit('/admin/products');
    cy.wait('@products').its('response.statusCode').should('eq', 200);

    cy.get('.listing')
        .find('a')
        .contains('White Sneakers');
  });
})

describe('Admin Products - Edit Page', () => {
  beforeEach(() => {
    admin_login();
    cy.intercept('Post', '/admin/user/login').as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.visit('/admin/products');
  });

  it('should display the edit page for a certain product', () => {
    cy.get('.listing')
      .find('a')
      .contains('White Sneakers')
      .click();
    cy.url().should('include', '/edit');
  });

  it('should successfully edit a product', () => {
    cy.get('.listing')
      .find('a')
      .contains('White Sneakers')
      .click();

    cy.get('input[id="name"]').type(" Strips");
    cy.findByText('Save').click();

    cy.intercept('Get', '/admin/products').as('products');
    cy.get('.breadcrum-icon > .flex').click();
    cy.wait('@products').its('response.statusCode').should('eq', 200);

    cy.get('.listing')
      .find('a')
      .contains("White Sneakers Strips");
  });

  it('should delete a product', () => {
    cy.contains('tr', "White Sneakers Strips")
      .find('td')
      .first()
      .click();
    cy.findByText('Delete').click();
    cy.get('.critical > span').click();

    cy.get('.listing')
      .find('a')
      .should('not.contain', "White Sneakers Strips");
  });
});