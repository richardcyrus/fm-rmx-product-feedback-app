/// <reference types="cypress" />
import faker from "@faker-js/faker";

const feedback = {
  id: 2,
  title: "Add a dark theme option",
  category: "Feature",
  upvotes: 99,
  status: "suggestion",
  description:
    "It would help people with light sensitivities and who prefer dark mode.",
  comments: 4,
};

describe("View Feedback Page", () => {
  before(() => {
    cy.resetDb();
    cy.seedDb();
  });

  beforeEach(() => {
    cy.viewport("macbook-16");
    cy.visit(`/feedback/view/${feedback.id}`);
    cy.injectAxe();
    cy.configureAxe({
      rules: [{ id: "color-contrast", enabled: false }],
    });
  });

  it("has no accessibility violations", () => {
    cy.checkA11y();
  });

  it("should have a button to edit the current Feedback record", () => {
    cy.findByRole("link", { name: "Edit Feedback" })
      .should("exist")
      .and("have.attr", "href", "/feedback/edit/2");
  });

  it("should render the correct feedback detail information", () => {
    cy.get(".suggestion-title").should("have.text", feedback.title);
    cy.get(".suggestion-description").should("have.text", feedback.description);
    cy.get(".suggestion-category").should("have.text", feedback.category);
    cy.get(".vote-count").should("have.text", feedback.upvotes);
    cy.get(".comment-count").should("have.text", feedback.comments);
  });

  it("should render a section with comments", () => {
    cy.get("#comments-section-title").should(
      "have.text",
      `${feedback.comments} Comments`
    );
  });

  it("should render an add comment form", () => {
    cy.get(`#add-comment-title-${feedback.id}`)
      .should("exist")
      .and("have.text", "Add Comment");
    cy.findByTestId("productId-input").should("have.value", feedback.id);
    cy.findByText(/post comment/i).should("exist");
  });
});

describe("Add new comments to product feedback requests", () => {
  before(() => {
    cy.resetDb();
    cy.seedDb();
  });

  beforeEach(() => {
    cy.viewport("macbook-16");
    cy.visit(`/feedback/view/${feedback.id}`);
    cy.injectAxe();
    cy.configureAxe({
      rules: [{ id: "color-contrast", enabled: false }],
    });
  });

  const startingCommentCount = 4;
  const maxCharCount = 250;
  const shortComment = `${faker.lorem.sentences(5)}`.slice(0, 150);
  const countText = `${maxCharCount - shortComment.length} Characters left`;

  it("should fail validation on empty submission", () => {
    cy.findByRole("button", { name: /post comment/i }).click();
    cy.checkA11y();
    cy.get(`#description-error-${feedback.id}`).should(
      "contain",
      "Can't be empty"
    );
  });

  it("should show correct remaining character count for textbox", () => {
    cy.get("#add-comment").type(shortComment);
    cy.get("#remaining-characters").should("have.text", countText);
  });

  it("should save a new comment", () => {
    cy.get("#comments-section-title").should(
      "have.text",
      `${startingCommentCount} Comments`
    );
    cy.get("#add-comment").type(shortComment);
    cy.findByRole("button", { name: /post comment/i }).click();
    cy.get("#comments-section-title").should(
      "have.text",
      `${startingCommentCount + 1} Comments`
    );
  });
});

describe("Add comment replies to product feedback requests", () => {});
