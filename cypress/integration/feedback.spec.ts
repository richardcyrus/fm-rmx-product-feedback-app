/// <reference types="cypress" />

function a11yCheck() {
  const viewPorts: Array<Cypress.ViewportPreset> = [
    "macbook-15",
    "ipad-2",
    "iphone-6",
  ];

  cy.injectAxe();

  viewPorts.forEach((size) => {
    if (Cypress._.isArray(size)) {
      cy.viewport(size[0], size[1]);
    } else {
      cy.viewport(size);
    }

    cy.checkA11y();
  });
}

describe("Feedback Category page", () => {
  beforeEach(() => {
    cy.visit("/feedback/all");
  });

  it("Feedback Category page accessibility check", () => {
    cy.contains("Feedback Board");
    a11yCheck();
  });
});
