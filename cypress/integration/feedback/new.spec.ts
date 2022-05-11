/// <reference types="cypress" />

describe("Create a product feedback request", () => {
  it("should allow to cancel create with no new inputs", () => {
    cy.visit("/feedback/new");
    cy.findByText(/Cancel/i).click();
    cy.url().should("include", "/feedback/all");
  });
});
