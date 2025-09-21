/// <reference types="cypress" />

describe('News Dashboard E2E Tests', () => {

  const mockNewsIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  const createMockNewsItem = (id: number) => ({
    id: id,
    title: `Mock News Title ${id}`,
    url: `http://mock.com/${id}`,
    user: 'user1',
    time: Math.floor(Date.now() / 1000),
    domain: 'mock.com',
    points: 10,
    comments_count: 5,
  });

  beforeEach(() => {
    cy.intercept('GET', 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty', (req) => {
      req.reply({
        body: mockNewsIds,
        delay: 500,
      });
    }).as('getTopNewsIds');


    cy.intercept('GET', 'https://hacker-news.firebaseio.com/v0/item/*.json?print=pretty', (req) => {
      const id = req.url.split('/').slice(-1)[0].replace('.json', '');
      req.reply({ body: createMockNewsItem(Number(id)), delay: 50 });
    }).as('getNewsItem');

    cy.visit('/dashboard');
  });

  it('should display the dashboard with a list of news items after loading', () => {

    cy.get('a').should('contain', 'Top News');
    cy.get('a').should('contain', 'Latest News');

    cy.get('[data-cy="loading-message"]').should('be.visible');

    cy.wait('@getTopNewsIds');
    cy.wait('@getNewsItem');

    cy.get('[data-cy="loading-message"]').should('not.exist');

    cy.get('[data-cy="news-item"]').should('have.length', 10);
  });

  it('should load more news items when the "Load More" button is clicked', () => {
    cy.wait('@getTopNewsIds');
    cy.wait('@getNewsItem');

    cy.get('[data-cy="news-item"]').should('have.length', 10);

    cy.get('[data-cy="load-more-button"]').click();

    cy.wait('@getNewsItem');

    cy.get('[data-cy="news-item"]').should('have.length', 5);
  });

  it('should display an error message if the API fails', () => {

    cy.intercept('GET', 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty', {
      statusCode: 500,
      body: 'Internal Server Error',
    }).as('apiError');

    cy.visit('/dashboard');

    cy.wait('@apiError');

    cy.get('[data-cy="error-message"]').should('be.visible').and('contain', 'Failed to load news');

    cy.get('[data-cy="loading-message"]').should('not.exist');
    cy.get('[data-cy="news-item"]').should('not.exist');
  });
});
