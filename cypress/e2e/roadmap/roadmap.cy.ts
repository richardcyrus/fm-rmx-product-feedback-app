/// <reference types="cypress" />

import ViewportPreset = Cypress.ViewportPreset;

function testA11y() {
  const viewPorts: Array<ViewportPreset> = ["macbook-15", "ipad-2", "iphone-6"];

  cy.injectAxe();
  cy.configureAxe({
    rules: [{ id: "color-contrast", enabled: false }],
  });

  viewPorts.forEach((size) => {
    if (Cypress._.isArray(size)) {
      cy.viewport(size[0], size[1]);
    } else {
      cy.viewport(size);
    }

    cy.checkA11y();
  });
}

describe("Roadmap page passes accessibility tests", () => {
  beforeEach(() => {
    cy.visit("/roadmap");
  });

  it("Roadmap page accessibility check", () => {
    cy.contains("Roadmap");
    testA11y();
  });
});
