/// <reference types="cypress" />

describe("When visiting the app's base URL", () => {
  it("it should redirect to `/feedback/all`", () => {
    cy.request({ url: "/", followRedirect: false }).then((res) => {
      expect(res.status).to.eq(302);
      expect(res.redirectedToUrl).to.eq(
        `${Cypress.config().baseUrl}/feedback/all`
      );
    });
  });

  it("it should render the category `All` page", () => {
    cy.visit("/");
    cy.contains(/feedback board/i);
  });
});

// describe("View the optimal layout for the app based on screen size", () => {});

/**
 * Considerations:
 * - Move to separate spec where all "pages" are tested for a11y in all viewports.
 */
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

describe("Test accessibility for each screen size", () => {
  it("The home page should be accessible", () => {
    cy.visit("/");
    cy.contains(/feedback board/i);
    a11yCheck();
  });
});
