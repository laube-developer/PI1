/// <reference types="cypress-real-events" />

describe('Dashboard Functionality', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('atyrson10@gmail.com');
    cy.get('input[type="password"]').type('senhamuitoboaparausar');
        cy.get('button[type="submit"]').click();
        cy.wait(1000);
        cy.url({ timeout: 10000 }).should('include', '/dashboard');
      });
    
      it('CT-19 – Deve remover um comando da fila', () => {
        cy.get('button').contains('Conectar').click();
        cy.wait(1000); 
        cy.get('button').contains('Andar').click();
        cy.wait(500);
        cy.get('button').contains('Virar').click();
        cy.wait(500); 
        cy.get('button').contains('Largar').click();
        cy.wait(1000); 
    
        cy.get('[data-testid^="command-card-"]').should('have.length', 3);
        cy.contains('Virar').should('be.visible');
    
        cy.get('[data-testid="command-card-1"]').find('button[class*="bg-red-"]').click({ force: true });
        cy.wait(2000); 
    
        cy.get('[data-testid="command-list"]').contains('Virar').should('not.exist');
        cy.get('[data-testid^="command-card-"]').should('have.length', 2);
        cy.contains('Andar').should('be.visible');
        cy.contains('Largar').should('be.visible');      });
    
    it('CT-20 – Deve reordenar comandos com drag and drop', () => {
        cy.get('button').contains('Conectar').click();
        cy.wait(1000); 
        cy.get('button').contains('Andar').click();
        cy.wait(500);
        cy.get('button').contains('Virar').click();
        cy.wait(500);
        cy.get('button').contains('Largar').click();
        cy.wait(1000); 
    
    cy.get('[data-testid^="command-card-"]').eq(0).should('contain', 'Andar');
    cy.get('[data-testid^="command-card-"]').eq(1).should('contain', 'Virar');
    cy.get('[data-testid^="command-card-"]').eq(2).should('contain', 'Largar');
    cy.wait(1000);

    cy.get('[data-testid="command-card-2"]').as('cardToDrag');
    
    cy.get('@cardToDrag').realPress('Escape');
    cy.get('@cardToDrag').rightclick();
    cy.get('@cardToDrag').realPress('Space');
    
    cy.wait(500);
    
    cy.get('@cardToDrag').realPress('ArrowLeft');
    
    cy.wait(500);
    
    cy.get('@cardToDrag').realPress('ArrowLeft');
    
    cy.wait(500);
    
    cy.get('@cardToDrag').realPress('Space');

    cy.wait(2000);

    cy.get('[data-testid^="command-card-"]').eq(0).should('contain', 'Largar');
    cy.get('[data-testid^="command-card-"]').eq(1).should('contain', 'Andar');
    cy.get('[data-testid^="command-card-"]').eq(2).should('contain', 'Virar');
  });
    });
