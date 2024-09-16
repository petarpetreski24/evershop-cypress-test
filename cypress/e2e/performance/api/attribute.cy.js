describe('EverShop Product Attribute API', () => {
    let sessionId;
    let attributeUuid;

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

    it('should make an api call to create a new attribute in less than 1 second', () => {
        const startTime = Date.now();
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/attributes',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: {
                attribute_name: 'Material',
                attribute_code: 'material',
                type: 'Select',
                is_required: 1,
                display_on_frontend: 1,
                sort_order: 5,
                is_filterable: 1,
                groups: [0],
                options: [
                    { option_text: 'Cotton' },
                    { option_text: 'Polyester' }
                ]
            }
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Create attribute response time: ${responseTime} ms`);

            expect(response.status).to.eq(200);
            expect(responseTime).to.be.lessThan(1000);

            const { data } = response.body;
            attributeUuid = data.uuid;
        });
    });

    it('should make an api call to update the attribute in less than 1 second', () => {
        const startTime = Date.now();

        cy.request({
            method: 'PATCH',
            url: `http://localhost:3000/api/attributes/${attributeUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: {
                attribute_name: 'Material Updated',
                type: 'Text',
                is_required: 0,
                display_on_frontend: 0,
                sort_order: 10,
                is_filterable: 0,
                groups: [1]
            }
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Update attribute response time: ${responseTime} ms`);
            
            expect(response.status).to.eq(200);
            expect(responseTime).to.be.lessThan(1000);

            const { data } = response.body;
        });
    });

    it('should make an api call to delete the attribute in less than 1 second', () => {
        const startTime = Date.now();

        cy.request({
            method: 'DELETE',
            url: `http://localhost:3000/api/attributes/${attributeUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            }
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Delete attribute response time: ${responseTime} ms`);
            
            expect(response.status).to.eq(200);
            expect(responseTime).to.be.lessThan(1000);
        });
    });

    it('should make an api call to not find the deleted attribute in less than 1 second', () => {
        const startTime = Date.now();

        cy.request({
            method: 'GET',
            url: `http://localhost:3000/api/attributes/${attributeUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            failOnStatusCode: false
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Get deleted attribute response time: ${responseTime} ms`);

            expect(response.status).to.eq(404);
            expect(responseTime).to.be.lessThan(1000);
        });
    });
});
