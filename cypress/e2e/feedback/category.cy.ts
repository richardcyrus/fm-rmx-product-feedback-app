/// <reference types="cypress" />

describe("Filter suggestions by category", () => {
  beforeEach(() => {
    cy.viewport("macbook-16");
    cy.visit("/");
  });

  const categoryList = [
    { category: "All", count: 6 },
    { category: "UI", count: 0 },
    { category: "UX", count: 0 },
    { category: "Enhancement", count: 2 },
    { category: "Bug", count: 1 },
    { category: "Feature", count: 3 },
  ];

  categoryList.forEach((item) => {
    it(`category is ${item.category}`, () => {
      cy.findByRole("link", { name: item.category }).click();
      cy.url().should("include", `/feedback/${item.category.toLowerCase()}`);
      cy.findByRole("link", { name: item.category }).should(
        "have.class",
        "active"
      );

      item.count === 0
        ? cy.findByText(/there is no feedback yet/i).should("exist")
        : cy.get(".suggestion-category").should("have.length", item.count);
    });
  });
});

describe("Sort suggestions", () => {
  const sortVotes = [
    {
      sortType: "Least Upvotes",
      first: 3,
      last: 112,
    },
  ];

  const sortComments = [
    {
      sortType: "Most Comments",
      first: 4,
      last: 0,
    },
    {
      sortType: "Least Comments",
      first: 0,
      last: 4,
    },
  ];

  beforeEach(() => {
    cy.viewport("macbook-16");
  });

  /**
   * When visiting the home page, the default sort is "Most Upvotes". Attempting
   * to change the listbox to the same value does not trigger its onChange event.
   * We simply validate that the choice is correct and move on for additional
   * testing.
   */
  it("by Most Upvotes", () => {
    cy.visit("/");
    cy.findByLabelText(/sort by/i).should("have.text", "Most Upvotes");
    cy.get(
      ":nth-child(2) > .suggestion-card > .vote-container > .button"
    ).should("have.text", "112");
    cy.get(
      ":nth-child(7) > .suggestion-card > .vote-container > .button"
    ).should("have.text", "3");
  });

  /**
   * The following groups, use the list box to change the sort, validate that it
   * displays the currently active sort and validates the first and last suggestion
   * card have the correct vote or comment values.
   */
  sortVotes.forEach((item) => {
    it(`by ${item.sortType}`, () => {
      cy.visit("/");
      cy.findByLabelText(/sort by/i).click();
      cy.findByRole("option", { name: item.sortType }).click();
      cy.findByLabelText(/sort by/i).should("have.text", item.sortType);
      cy.get(
        ":nth-child(2) > .suggestion-card > .vote-container > .button"
      ).should("have.text", item.first);
      cy.get(
        ":nth-child(7) > .suggestion-card > .vote-container > .button"
      ).should("have.text", item.last);
    });
  });

  sortComments.forEach((item) => {
    it(`by ${item.sortType}`, () => {
      cy.visit("/");
      cy.findByLabelText(/sort by/i).click();
      cy.findByRole("option", { name: item.sortType }).click();
      cy.findByLabelText(/sort by/i).should("have.text", item.sortType);
      cy.get(
        ":nth-child(2) > .suggestion-card > .comment-info > .comment-count"
      ).should("have.text", item.first);
      cy.get(
        ":nth-child(7) > .suggestion-card > .comment-info > .comment-count"
      ).should("have.text", item.last);
    });
  });
});

describe("Upvote product feedback requests", () => {});
