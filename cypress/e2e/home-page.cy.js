describe('Evershop Website Tests', () => {

    beforeEach(() => {
      cy.visit('/');
    });

    Cypress.on('uncaught:exception', (err, runnable) => false);

    it('should verify navigation bar links', () => {
      cy.get('.nav-link[href="/kids"]').should('contain.text', 'Kids').click();
      cy.url().should('include', '/kids');
      
      cy.get('.nav-link[href="/women"]').should('contain.text', 'Women').click();
      cy.url().should('include', '/women');
      
      cy.get('.nav-link[href="/men"]').should('contain.text', 'Men').click();
      cy.url().should('include', '/men');
    });
  
    it('should verify the search icon is clickable', () => {
      cy.get('.search-icon').should('be.visible').click();
    });
  
    it('should verify mini cart icon redirects to cart page', () => {
      cy.get('.mini-cart-icon').should('be.visible').click();
      cy.url().should('include', '/cart');
    });
  
    it('should verify account icon redirects to account page', () => {
        cy.get('.self-center').eq(2).should('be.visible').click();
        cy.url().should('include', '/account');
      });
  
    it('should verify the main banner displays correctly', () => {
      cy.get('.main-banner-home h2').should('contain.text', 'Discount 20% For All Orders Over $2000');
      cy.get('.main-banner-home span.font-bold').should('contain.text', 'DISCOUNT20');
    });
  
    it('should verify product banners', () => {
      cy.get('h3').contains('Men shoes collection').should('be.visible');
      cy.get('h3').contains('Women shoes collection').should('be.visible');
      
      cy.get('a[href="/kids"]').eq(1).should('contain.text', 'Shop kids').click();
      cy.url().should('include', '/kids');
    });
  
    it('should enter "Denim" in the search field, submit, and display correct search results', () => {
        cy.get('.search-icon').click();
        cy.get('.search-input input[type="text"]', { timeout: 10000 })
          .should('be.visible')
          .clear()
          .type('Denim{enter}'); 
        cy.url().should('include', 'search?keyword=Denim');
        cy.get('.page-width.my-2 span').last().should('contain.text', 'Search results for: Denim');
        cy.get('.search-name').should('contain.text', 'Search results for "Denim"');
        cy.get('.listing-tem .product-name').should('contain.text', 'Denim Skinny Jeans');
    });

    it('should display the mobile menu button and click it to show the menu', () => {
        cy.viewport('iphone-x');
    
        cy.get('.main-menu-mobile .menu-icon').should('be.visible').click();
        
        cy.get('.main-menu-mobile .nav').should('be.visible');
        
        cy.get('.main-menu-mobile .nav-item').eq(0).find('.nav-link').should('contain.text', 'Kids').click();
        cy.url().should('include', '/kids');
        cy.get('.main-menu-mobile .menu-icon').should('be.visible').click();
        cy.get('.main-menu-mobile .nav').should('be.visible');
    
        cy.get('.main-menu-mobile .nav-item').eq(1).find('.nav-link').should('contain.text', 'Women').click();
        cy.url().should('include', '/women');
        cy.get('.main-menu-mobile .menu-icon').should('be.visible').click();
        cy.get('.main-menu-mobile .nav').should('be.visible');
    
        cy.get('.main-menu-mobile .nav-item').eq(2).find('.nav-link').should('contain.text', 'Men').click();
        cy.url().should('include', '/men');
        cy.get('.main-menu-mobile .menu-icon').should('be.visible').click();
        cy.get('.main-menu-mobile .nav').should('be.visible');
      });

      it('should verify payment icons are clickable', () => {
    
        cy.get('.card-icons').find('svg[aria-labelledby="pi-visa"]').should('be.visible').click();
    
        cy.get('.card-icons').find('svg[aria-labelledby="pi-master"]').should('be.visible').click();

        cy.get('.card-icons').find('svg[aria-labelledby="pi-paypal"]').should('be.visible').click();
      });
  
  });
  