describe('EverShop Product API', () => {
    let sessionId;
    let productUuid;

    beforeEach(() => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/admin/user/login',
            headers: {
                'Accept': 'application/json'
            },
            body: {
                email: 'admin@evershop.io',
                password: '12345678'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            sessionId = response.body.data.sid;
        });
    });

    it('should make an api call to create a new product in less than 1 second', () => {
      const startTime = Date.now();
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/products',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: {
                name: 'Product XYZ',
                description: 'Description of Product XYZ',
                short_description: 'Short Description',
                url_key: 'product-xyz',
                meta_title: 'Product XYZ Meta Title',
                meta_description: 'Meta description for Product XYZ',
                meta_keywords: 'product,xyz',
                status: 1,
                sku: 'XYZ123',
                price: 99.99,
                weight: 1.5,
                qty: 100,
                group_id: 1,
                visibility: 0
            }
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Create product response time: ${responseTime} ms`);

            expect(response.status).to.eq(200);
            expect(responseTime).to.be.lessThan(1000);
            const { data } = response.body;
            productUuid = data.uuid;
        });
    });

    it('should make an api call to update the product in less than 1 second', () => {
      const startTime = Date.now();
        cy.request({
            method: 'PATCH',
            url: `http://localhost:3000/api/products/${productUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: {
                name: 'Product XYZ Updated',
                description: 'Updated description for Product XYZ',
                short_description: 'Updated Short Description',
                url_key: 'product-xyz-updated',
                meta_title: 'Product XYZ Updated Meta Title',
                meta_description: 'Updated Meta description for Product XYZ',
                meta_keywords: 'product,xyz,updated',
                status: 1,
                sku: 'XYZ123-UPD',
                price: 109.99,
                weight: 1.8,
                qty: 150,
                manage_stock: 1,
                stock_availability: 1,
                group_id: 1,
                visibility: 1
            }
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Update product response time: ${responseTime} ms`);

            expect(response.status).to.eq(200);
            expect(responseTime).to.be.lessThan(1000);
            const { data } = response.body;
        });
    });

    it('should make an api call to delete the product in less than 1 second', () => {
      const startTime = Date.now();
        cy.request({
            method: 'DELETE',
            url: `http://localhost:3000/api/products/${productUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            }
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Delete product response time: ${responseTime} ms`);

            expect(response.status).to.eq(200);
            expect(responseTime).to.be.lessThan(1000);
            const { data } = response.body;
        });
    });

    it('should make an api call to verify that the product has been deleted in less than 1 second', () => {
      const startTime = Date.now();
        cy.request({
            method: 'GET',
            url: `http://localhost:3000/api/products/${productUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            failOnStatusCode: false
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Verify product response time: ${responseTime} ms`);

            expect(response.status).to.eq(404);
            expect(responseTime).to.be.lessThan(1000);
        });
    });
});
