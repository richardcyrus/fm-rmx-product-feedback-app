/// <reference types="cypress" />

describe("Filter suggestions by category", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  /**
   * Considerations:
   * - Validate correct panel is rendered when there are no suggestions.
   * - Can/Should fixtures be used to provide consistent test data?
   */

  it("category === All", () => {
    cy.findByRole("link", { name: "All" }).click();
    cy.url().should("include", "/feedback/all");
    cy.findByRole("link", { name: "All" }).should("have.class", "active");
    cy.get(".suggestion-category").should("have.length", 6);
  });

  it("category === UI", () => {
    cy.findByRole("link", { name: "UI" }).click();
    cy.url().should("include", "/feedback/ui");
    cy.findByRole("link", { name: "UI" }).should("have.class", "active");
    cy.get(".suggestion-category").should("have.length", 0);
  });

  it("category === UX", () => {
    cy.findByRole("link", { name: "UX" }).click();
    cy.url().should("include", "/feedback/ux");
    cy.findByRole("link", { name: "UX" }).should("have.class", "active");
    cy.get(".suggestion-category").should("have.length", 0);
  });

  it("category === Enhancement", () => {
    cy.findByRole("link", { name: "Enhancement" }).click();
    cy.url().should("include", "/feedback/enhancement");
    cy.findByRole("link", { name: "Enhancement" }).should(
      "have.class",
      "active"
    );
    cy.get(".suggestion-category").should("have.length", 2);
  });

  it("category === Bug", () => {
    cy.findByRole("link", { name: "Bug" }).click();
    cy.url().should("include", "/feedback/bug");
    cy.findByRole("link", { name: "Bug" }).should("have.class", "active");
    cy.get(".suggestion-category").should("have.length", 1);
  });

  it("category === Feature", () => {
    cy.findByRole("link", { name: "Feature" }).click();
    cy.url().should("include", "/feedback/feature");
    cy.findByRole("link", { name: "Feature" }).should("have.class", "active");
    cy.get(".suggestion-category").should("have.length", 3);
  });
});

describe("Sort suggestions", () => {});

describe("Upvote product feedback requests", () => {});
