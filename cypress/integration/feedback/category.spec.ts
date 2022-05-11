/// <reference types="cypress" />

describe("Filter suggestions by category", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  /**
   * Considerations:
   * - Can/Should fixtures or other data be used to provide consistent test data?
   */

  const categoryList = [
    { category: "All", count: 6 },
    { category: "UI", count: 0 },
    { category: "UX", count: 0 },
    { category: "Enhancement", count: 2 },
    { category: "Bug", count: 1 },
    { category: "Feature", count: 3 },
  ];

  categoryList.forEach((item) => {
    it(`category === ${item.category}`, () => {
      cy.findByRole("link", { name: item.category }).click();
      cy.url().should("include", `/feedback/${item.category.toLowerCase()}`);
      cy.findByRole("link", { name: item.category }).should(
        "have.class",
        "active"
      );

      // eslint-disable-next-line chai-friendly/no-unused-expressions
      item.count === 0
        ? cy.findByText(/there is no feedback yet/i).should("exist")
        : cy.get(".suggestion-category").should("have.length", item.count);
    });
  });
});

describe("Sort suggestions", () => {});

describe("Upvote product feedback requests", () => {});
