describe('Product Listings', () => {
  beforeEach(() => {
    cy.visit('/men');
  });

  it('should display featured items with correct details', () => {
    const products = [
      { name: "Men's Winter Gloves", price: '$19.99', link: '/men/mens-winter-gloves' },
      { name: "Men's Long Sleeve T-Shirt", price: '$34.99', link: '/men/mens-long-sleeve-t-shirt' },
      { name: "Men's Dress Pants", price: '$79.99', link: '/men/mens-dress-pants' },
      { name: "Men's Tracksuit", price: '$89.99', link: '/men/mens-tracksuit' },
      { name: "Men's Button-Down Shirt", price: '$44.99', link: '/men/mens-button-down-shirt' }
    ];

    products.forEach((product) => {
      cy.contains('.product-name', product.name)
        .should('be.visible')
        .find('a')
        .should('have.attr', 'href', product.link);

      cy.contains('.sale-price', product.price)
        .should('be.visible');
    });
  });
});

describe('Product Details Page', () => {
    beforeEach(() => {
      cy.visit('/men/mens-winter-gloves');
    });
  
    it('should display product details correctly', () => {
      cy.contains('.product-single-name', "Men's Winter Gloves")
        .should('be.visible');
  
      cy.contains('.sale-price', '$19.99')
        .should('be.visible');
  
      cy.get('.product-image').should('be.visible');
    });
  });
  