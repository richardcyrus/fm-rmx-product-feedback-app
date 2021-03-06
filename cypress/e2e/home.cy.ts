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

  it("it should render the category `All` view", () => {
    cy.visit("/");
    cy.findByRole("link", { name: "All" })
      .should("exist")
      .and("have.class", "active");
  });

  it("should have a link to the Roadmap page", () => {
    cy.visit("/");
    cy.findByRole("link", { name: "View" })
      .should("exist")
      .and("have.class", "roadmap-view__link")
      .and("have.attr", "href", "/roadmap");
  });

  it("should list the Roadmap categories statistics", () => {
    const roadmapStats = [
      { category: "In Progress", count: 3 },
      { category: "Planned", count: 2 },
      { category: "Live", count: 1 },
    ];

    cy.visit("/");
    roadmapStats.forEach((stat, index) => {
      cy.findByText(stat.category).should("exist");
      cy.get(
        `:nth-child(${++index}) > .roadmap-summary__category > .roadmap-summary__category-count`
      ).should("have.text", stat.count);
    });
  });

  it("should have a button to add new Feedback", () => {
    cy.visit("/");
    cy.findByRole("link", { name: "Add Feedback" })
      .should("exist")
      .and("have.attr", "href", "/feedback/new");
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
