describe('App Component', () => {
  it('should display welcome message', () => {
    cy.visit('/');
    cy.get('app-top-menu').should('exist');
  });
});
