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

    it('should successfully create a new attribute', () => {
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
        expect(response.status).to.eq(200);
        const { data } = response.body;
        expect(data).to.have.property('attribute_id');
        expect(data).to.have.property('attribute_name', 'Material');
        attributeUuid = data.uuid; 
      });
    });

    it('should successfully update the attribute', () => {
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
        expect(response.status).to.eq(200);
        const { data } = response.body;
        expect(data).to.have.property('attribute_name', 'Material Updated');
      });
    });

    it('should successfully delete the attribute', () => {
      cy.request({
        method: 'DELETE',
        url: `http://localhost:3000/api/attributes/${attributeUuid}`,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionId}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.have.property('attribute_id');
      });
    });

    it('should not find the deleted attribute', () => {
        cy.request({
          method: 'GET',
          url: `http://localhost:3000/api/attributes/${attributeUuid}`,
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
