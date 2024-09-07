describe('EverShop Category API', () => {
    let sessionId;
    let categoryUuid;

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

    it('should successfully create a new category', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/categories',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: {
                name: 'Category ABC',
                description: 'Description for Category ABC',
                meta_title: 'Category ABC Meta Title',
                meta_description: 'Meta description for Category ABC',
                meta_keywords: 'category,abc',
                url_key: 'category-abc',
                status: 1,
                include_in_nav: 1
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            const { data } = response.body;
            expect(data).to.have.property('category_id');
            expect(data).to.have.property('name', 'Category ABC');
            categoryUuid = data.uuid;
        });
    });

    it('should successfully update the category', () => {
        cy.request({
            method: 'PATCH',
            url: `http://localhost:3000/api/categories/${categoryUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: {
                name: 'Category ABC Updated',
                description: 'Updated description for Category ABC',
                meta_title: 'Category ABC Updated Meta Title',
                meta_description: 'Updated Meta description for Category ABC',
                meta_keywords: 'category,abc,updated',
                url_key: 'category-abc-updated',
                status: 1,
                include_in_nav: 0,
                position: 2
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            const { data } = response.body;
            expect(data).to.have.property('name', 'Category ABC Updated');
            expect(data).to.have.property('url_key', 'category-abc-updated');
        });
    });

    it('should successfully delete the category', () => {
        cy.request({
            method: 'DELETE',
            url: `http://localhost:3000/api/categories/${categoryUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            const { data } = response.body;
            expect(data).to.have.property('category_id');
            expect(data).to.have.property('uuid', categoryUuid);
        });
    });

    it('should verify that the category has been deleted', () => {
        cy.request({
            method: 'GET',
            url: `http://localhost:3000/api/categories/${categoryUuid}`,
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
