describe('Empty Cart Checkout Flow', () => {
    it('should not allow proceeding to checkout with an empty cart', () => {
      cy.visit('/');
      
      cy.get('.mini-cart-wrapper .mini-cart-icon').click();
      
      cy.get('.shopping-cart-checkout-btn .button.primary').should('not.exist');
      cy.contains('Your cart is empty!').should('exist');
    });
});

describe('Remove Item from Cart', () => {
    it('should remove an item from the cart', () => {
      cy.visit('/');
      
      cy.get('.grid .listing-tem').first().click();
      cy.get('button.primary.outline').contains('ADD TO CART').click();
      
      cy.get('.mini-cart-wrapper .mini-cart-icon').click();
      cy.get('#shopping-cart-items > table > tbody > tr:nth-child(1) > td:nth-child(1) > div > div.cart-tem-info > div > a').click();
      
      cy.get('.cart-item').should('not.exist');
    });
});

describe('Multiple Items Cart', () => {
    it('should add multiple items to the cart and verify total', () => {
      cy.visit('/');
      
      cy.get('.grid .listing-tem').eq(0).click();
      cy.get('button.primary.outline').contains('ADD TO CART').click();
      cy.contains('Continue Shopping').click();

      cy.visit('/');
      cy.get('.grid .listing-tem').eq(1).click();
      cy.get('button.primary.outline').contains('ADD TO CART').click();
      
      cy.get('.mini-cart-wrapper .mini-cart-icon').click();
      
      cy.get('tr').should('have.length', 3);
      cy.get('.grand-total-value').then($total => {
        expect($total.text().trim()).to.eq('$210.00');
      });
    });
});

describe('Apply Coupon Code', () => {
    it('should apply a coupon code and adjust the total price', () => {
      cy.visit('/');
      
      cy.get('.grid .listing-tem').first().click();
      cy.get('input[name="qty"]').type('20');
      cy.get('button.primary.outline').contains('ADD TO CART').click();
      cy.get('.mini-cart-wrapper .mini-cart-icon').click();
  
      cy.get('input[name="coupon"]').type('DISCOUNT20');
      cy.get('#couponForm > div > div.col-span-1 > button').click();
      cy.contains('Coupon applied successfully!');
  
      cy.get('.grand-total-value').then($total => {
        expect($total.text().trim()).to.eq('$8,640.00');
      });
    });
});

describe('Apply Coupon Code Without Satisfied Condition', () => {
    it('should not apply a coupon code and not adjust the total price', () => {
      cy.visit('/');
      
      cy.get('.grid .listing-tem').first().click();
      cy.get('input[name="qty"]').type('1');
      cy.get('button.primary.outline').contains('ADD TO CART').click();
      cy.get('.mini-cart-wrapper .mini-cart-icon').click();
  
      cy.get('input[name="coupon"]').type('DISCOUNT20');
      cy.get('#couponForm > div > div.col-span-1 > button').click();
      cy.contains('Invalid coupon');
  
      cy.get('.grand-total-value').then($total => {
        expect($total.text().trim()).to.eq('$990.00');
      });
    });
});

describe('E-commerce Checkout Flow', () => {
    it('should add a featured item to the cart and proceed to checkout', () => {
      cy.visit('/');
  
      cy.get('.grid .listing-tem').first().click();
  
      cy.get('button.primary.outline').contains('ADD TO CART').click();
  
      cy.get('.mini-cart-wrapper .mini-cart-icon').click();
  
      cy.get('.shopping-cart-checkout-btn .button.primary').contains('CHECKOUT').click();

      cy.get('input[name="email"]').type('demo@evershop.io');
      cy.get('button').contains('Continue to shipping').click();
  
      cy.get('input[name="address[full_name]"]').type('Demo User');
      cy.get('input[name="address[telephone]"]').type('1234567890');
      cy.get('input[name="address[address_1]"]').type('123 Demo Street');
      cy.get('input[name="address[city]"]').type('Demo City');
      cy.get('input[name="address[postcode]"]').type('12345');
  
      cy.get('button').contains('Continue to payment').click();
    });
});
  