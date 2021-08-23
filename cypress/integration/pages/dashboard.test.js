/* eslint-disable no-undef */
describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.config().baseUrl}/login`);
    cy.get('body').within(() => {
      cy.get('div').should('contain.text', "Don't have an account? Sign up");
    });

    cy.get('div')
      .find('img')
      .should('be.visible')
      .should('have.attr', 'alt')
      .should('contain', 'Iphone with Instagramme');

    cy.get('form').within(() => {
      cy.get('input:first')
        .should('have.attr', 'placeholder', 'Email address')
        .type('phuocthanhqt113@gmail.com');

      cy.get('input:last').should('have.attr', 'placeholder', 'Password').type('123456');
      cy.get('button').should('contain.text', 'Login').click();
    });

    cy.get('div')
      .find('img')
      .should('be.visible')
      .should('have.attr', 'alt')
      .should('contain', 'Instagramme');
  });

  it('logs the user in and shows the dashboard and does basic checks around the UI', () => {
    cy.wait(5000);

    cy.get('body').within(() => {
      cy.get('div').should('contain.text', 'hphuocthanh'); // username in the sidebar
      cy.get('div').should('contain.text', 'Thanh Hoang Phuoc'); // full name in the sidebar
      cy.get('div').should('contain.text', 'Suggestions for you'); // if the user has suggestions
    });
  });

  it('logs the user in and adds a comment to a photo', () => {
    cy.get('[data-testid="add-comment-MhZxas95vww83DBO4Pci"]')
      .should('have.attr', 'placeholder', 'Add a comment...')
      .type('Amazing photo!');
    cy.get('[data-testid="add-comment-submit-MhZxas95vww83DBO4Pci"]').submit();
  });

  it('logs the user in and likes a photo', () => {
    cy.wait(5000);

    cy.get('[data-testid="like-photo-MhZxas95vww83DBO4Pci"]').click();
  });

  it('logs the user in and then signs out', () => {
    cy.wait(5000);

    cy.get('[title="Logout"]').click();
    cy.wait(1000);
    cy.get('div').should('contain.text', "Don't have an account? Sign up"); // back to the login page
  });
});
