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

    it('should make an api call to create a new category in less than 1 second', () => {
        const startTime = Date.now();
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
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Create category response time: ${responseTime} ms`);

            expect(response.status).to.eq(200);
            expect(responseTime).to.be.lessThan(1000);
            const { data } = response.body;
            categoryUuid = data.uuid;
        });
    });

    it('should make an api call to update the category in less than 1 second', () => {
        const startTime = Date.now();
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
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Update category response time: ${responseTime} ms`);

            expect(response.status).to.eq(200);
            expect(responseTime).to.be.lessThan(1000);
            const { data } = response.body;
        });
    });

    it('should make an api call to delete the category in less than 1 second', () => {
        const startTime = Date.now();
        cy.request({
            method: 'DELETE',
            url: `http://localhost:3000/api/categories/${categoryUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            }
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Delete category response time: ${responseTime} ms`);

            expect(response.status).to.eq(200);
            expect(responseTime).to.be.lessThan(1000);
            const { data } = response.body;
        });
    });

    it('should make an api call to verify that the category has been deleted in less than 1 second', () => {
        const startTime = Date.now();
        cy.request({
            method: 'GET',
            url: `http://localhost:3000/api/categories/${categoryUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            failOnStatusCode: false
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Verify category response time: ${responseTime} ms`);

            expect(response.status).to.eq(404);
            expect(responseTime).to.be.lessThan(1000);
        });
    });
});
