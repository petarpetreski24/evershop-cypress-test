describe('EverShop Customer API', () => {
    let sessionId;
    let customerId;
    let customerUuid;

    const generateRandomNumber = () => Math.floor(Math.random() * 1000000); // Generates a random 6-digit number

    const newCustomer = {
        email: `testcustomer${generateRandomNumber()}@example.com`,
        password: 'password123',
        full_name: 'Test Customer'
    };

    const updatedCustomer = {
        email: `updatedcustomer${generateRandomNumber()}@example.com`,
        full_name: 'Updated Customer'
    };

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

    it('should make an api call to create a customer in less than 1 second', () => {
      const startTime = Date.now();
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/customers',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: newCustomer
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Create customer response time: ${responseTime} ms`);

            expect(response.status).to.eq(200);
            expect(responseTime).to.be.lessThan(1000);
            const { data } = response.body;
            customerId = data.customer_id;
            customerUuid = data.uuid;
        });
    });

    it('should make an api call to update the customer in less than 1 second', () => {
      const startTime = Date.now();
        cy.request({
            method: 'PATCH',
            url: `http://localhost:3000/api/customers/${customerUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: updatedCustomer
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Update customer response time: ${responseTime} ms`);

            expect(response.status).to.eq(200);
            expect(responseTime).to.be.lessThan(1000);
            const { data } = response.body;
        });
    });

    it('should make an api call to login the customer in less than 1 seond', () => {
      const startTime = Date.now();
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/customer/login',
            headers: {
                'Accept': 'application/json'
            },
            body: {
                email: updatedCustomer.email,
                password: 'password123'
            }
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Login customer response time: ${responseTime} ms`);

            expect(response.status).to.eq(200);
            expect(responseTime).to.be.lessThan(1000);
            const { data } = response.body;
        });
    });

    it('should make an api call to delete the customer in less than 1 second', () => {
      const startTime = Date.now();
        cy.request({
            method: 'DELETE',
            url: `http://localhost:3000/api/customers/${customerUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            }
        }).then((response) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            cy.log(`Delete customer response time: ${responseTime} ms`);

            expect(response.status).to.eq(200);
            expect(responseTime).to.be.lessThan(1000);
            const { data } = response.body;
        });
    });
});
