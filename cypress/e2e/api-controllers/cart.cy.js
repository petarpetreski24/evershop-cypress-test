describe('EverShop Cart API', () => {
    let sessionId;
    let cartId;
    let productUuid;
    const productSku = 'NJC90842-Blue-S';
    const productQty = 1;

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

    it('should create a product', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/products',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: {
                sku: productSku,
                name: 'Lite racer adapt 3.0 shoes',
                price: 823,
                url_key: 'lite-racer-adapt-30-shoes',
                description: 'Description of Product Lite racer adapt 3.0 shoes',
                short_description: 'Short Description',
                meta_title: 'Lite racer adapt 3.0 shoes Meta Title',
                meta_description: 'Meta description for Product Lite racer adapt 3.0 shoes',
                meta_keywords: 'product',
                status: 1,
                weight: 1.5,
                qty: 100,
                group_id: 1,
                visibility: 0
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            productUuid = response.body.data.uuid; 
        });
    });

    it('should create a new cart with the product', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/carts',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: {
                items: [{
                    sku: productSku,
                    qty: productQty
                }]
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            const { data } = response.body;
            expect(data).to.have.property('cartId');
            cartId = data.cartId;
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
});
