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

describe("Create a product feedback request", () => {
  it("should allow to cancel create with no new inputs", () => {
    cy.visit("/feedback/new");
    cy.findByText(/Cancel/i).click();
    cy.url().should("include", "/feedback/all");
  });
});

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
