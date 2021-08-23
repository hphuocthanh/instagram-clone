/* eslint-disable no-undef */
describe('Profile', () => {
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

    cy.wait(2000);
    cy.visit(`${Cypress.config().baseUrl}/p/bink`);
  });

  // user is logged in, go ahead and follow the user
  // if you have implemented the popup box on a user's page, try test that popup box!

  it('goes to a profile page and validates the UI', () => {
    cy.wait(5000);
    cy.get('div').should('contain.text', 'bink');
    cy.get('div').should('contain.text', 'Black Ink');
  });

  it('logs the user in and follows the user', () => {
    cy.wait(5000);
    cy.get('button').contains('Unfollow').click();
  });
});
