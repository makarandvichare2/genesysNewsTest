describe('App Component', () => {
  it('should display welcome message', () => {
    cy.visit('/');
    cy.contains('Welcome'); // change text depending on your app
  });
});
