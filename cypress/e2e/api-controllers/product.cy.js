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

    it('should successfully create a new product', () => {
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
            expect(response.status).to.eq(200);
            const { data } = response.body;
            expect(data).to.have.property('product_id');
            expect(data).to.have.property('name', 'Product XYZ');
            productUuid = data.uuid;
        });
    });

    it('should successfully update the product', () => {
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
            expect(response.status).to.eq(200);
            const { data } = response.body;
            expect(data).to.have.property('name', 'Product XYZ Updated');
            expect(data).to.have.property('sku', 'XYZ123-UPD');
        });
    });

    it('should successfully delete the product', () => {
        cy.request({
            method: 'DELETE',
            url: `http://localhost:3000/api/products/${productUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            const { data } = response.body;
            expect(data).to.have.property('product_id');
            expect(data).to.have.property('uuid', productUuid);
        });
    });

    it('should verify that the product has been deleted', () => {
        cy.request({
            method: 'GET',
            url: `http://localhost:3000/api/products/${productUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });
});
