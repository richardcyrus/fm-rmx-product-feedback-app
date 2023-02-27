/// <reference types="cypress" />
import { faker } from "@faker-js/faker";

describe("Create a product feedback request", () => {
  before(() => {
    cy.resetDb();
    cy.seedDb();
  });

  beforeEach(() => {
    cy.viewport("macbook-16");
    cy.visit("/feedback/new");
    cy.injectAxe();
    cy.configureAxe({
      rules: [{ id: "color-contrast", enabled: false }],
    });
  });

  const testFeedback = {
    title: `${faker.hacker.phrase()}`.slice(0, 50),
    category: "Enhancement",
    description: `${faker.lorem.sentences(8)}`.slice(0, 250),
  };

  it("has no accessibility violations", () => {
    cy.checkA11y();
  });

  it("should fail validation on empty submission", () => {
    cy.findByRole("button", { name: /add feedback/i }).click();
    cy.checkA11y();
    cy.get("#title-error").should("contain", "Can't be empty");
    cy.get("#description-error").should("contain", "Can't be empty");
  });

  it("should fail validation on empty title", () => {
    cy.findByLabelText(/category/i).click();
    cy.findByRole("option", { name: testFeedback.category }).click();
    cy.findByLabelText(/feedback detail/i).type(testFeedback.description);
    cy.findByRole("button", { name: /add feedback/i }).click();
    cy.checkA11y();
    cy.get("#title-error").should("contain", "Can't be empty");
  });

  it("should fail validation on empty description", () => {
    cy.findByLabelText(/feedback title/i).type(testFeedback.title);
    cy.findByLabelText(/category/i).click();
    cy.findByRole("option", { name: testFeedback.category }).click();
    cy.findByRole("button", { name: /add feedback/i }).click();
    cy.checkA11y();
    cy.get("#description-error").should("contain", "Can't be empty");
  });

  it("should allow to cancel create on empty submission", () => {
    cy.findByRole("button", {
      name: /Cancel/i,
    }).click();
    cy.url().should("include", "/feedback/all");
  });

  it("should allow to new create feedback", () => {
    cy.findByLabelText(/feedback title/i).type(testFeedback.title);
    cy.findByLabelText(/category/i).click();
    cy.findByRole("option", { name: testFeedback.category }).click();
    cy.findByLabelText(/feedback detail/i).type(testFeedback.description);
    cy.findByRole("button", { name: /add feedback/i }).click();
    cy.url().should("not.include", "/feedback/new");
    cy.url().should("include", "/feedback/view");
  });
});
