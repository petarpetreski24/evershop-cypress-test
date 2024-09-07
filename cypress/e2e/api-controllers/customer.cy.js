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

    it('should create a customer', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/customers',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: newCustomer
        }).then((response) => {
            expect(response.status).to.eq(200);
            const { data } = response.body;
            expect(data).to.have.property('customer_id');
            expect(data).to.have.property('uuid');
            customerId = data.customer_id;
            customerUuid = data.uuid;
        });
    });

    it('should update the customer', () => {
        cy.request({
            method: 'PATCH',
            url: `http://localhost:3000/api/customers/${customerUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            },
            body: updatedCustomer
        }).then((response) => {
            expect(response.status).to.eq(200);
            const { data } = response.body;
            expect(data).to.have.property('email', updatedCustomer.email);
            expect(data).to.have.property('full_name', updatedCustomer.full_name);
        });
    });

    it('should login the customer', () => {
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
            expect(response.status).to.eq(200);
            const { data } = response.body;
            expect(data).to.have.property('sid');
        });
    });

    it('should delete the customer', () => {
        cy.request({
            method: 'DELETE',
            url: `http://localhost:3000/api/customers/${customerUuid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${sessionId}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            const { data } = response.body;
            expect(data).to.have.property('customer_id', customerId);
            expect(data).to.have.property('uuid', customerUuid);
        });
    });
});
