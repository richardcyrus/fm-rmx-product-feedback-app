import { AxeBuilder } from "@axe-core/playwright";
import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { seed } from "@/prisma/seed-test";
import { truncateDb } from "@/tests/helpers/truncate-db";

test.describe.configure({ mode: "serial" });

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

test.beforeAll(async () => {
  await truncateDb();
  await seed();
});

test.describe("Test accessibility of the View Feedback page", () => {
  test("should not have any detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto(`/feedback/view/${feedback.id}`);
    expect(await page.textContent("body")).toContain(`${feedback.title}`);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe("View feedback", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/feedback/view/${feedback.id}`);
  });

  test("it should have a button to edit the current Feedback record", async ({
    page,
  }) => {
    await expect(
      page.getByRole("link", { name: "Edit Feedback" })
    ).toHaveAttribute("href", `/feedback/edit/${feedback.id}`);
  });

  test("it should render the correct feedback detail information", async ({
    page,
  }) => {
    await expect(page.locator(".suggestion-title")).toHaveText(feedback.title);
    await expect(page.locator(".suggestion-description")).toHaveText(
      feedback.description
    );
    await expect(page.locator(".suggestion-category")).toHaveText(
      feedback.category
    );
    await expect(page.locator(".vote-count")).toHaveText(
      String(feedback.upvotes)
    );
    await expect(page.locator(".comment-count")).toHaveText(
      String(feedback.comments)
    );
  });

  test("it should render a section with comments", async ({ page }) => {
    await expect(page.locator("#comments-section-title")).toHaveText(
      `${feedback.comments} Comments`
    );
  });

  test("it should render an add comment form", async ({ page }) => {
    await expect(page.locator(`#add-comment-title-${feedback.id}`)).toHaveText(
      "Add Comment"
    );
    await expect(page.getByTestId("productId-input")).toHaveValue(
      String(feedback.id)
    );
    await expect(page.getByText(/post comment/i)).toBeVisible();
  });
});

test.describe("Add new comments to feedback", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/feedback/view/${feedback.id}`);
  });

  const startingCommentCount = 4;
  const maxCharCount = 250;
  const shortComment = `${faker.lorem.sentences(5)}`.slice(0, 150);
  const countText = `${maxCharCount - shortComment.length} Characters left`;

  test("it should fail validation on empty submission", async ({ page }) => {
    await page.getByRole("button", { name: /post comment/i }).click();
    await expect(
      page.locator(`#description-error-${feedback.id}`)
    ).toContainText("Can't be empty");
  });

  test("it should show correct remaining character count for textbox", async ({
    page,
  }) => {
    await page.locator("#add-comment").fill(shortComment);
    await expect(page.locator("#remaining-characters")).toHaveText(countText);
  });

  test("it should save a new comment", async ({ page }) => {
    await page.locator("#add-comment").fill(shortComment);
    await page.getByRole("button", { name: /post comment/i }).click();
    await expect(page.locator("#comments-section-title")).toHaveText(
      `${startingCommentCount + 1} Comments`
    );
  });
});

test.describe("Add comment reply to feedback", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/feedback/view/${feedback.id}`);
  });

  const startingCommentCount = 5;
  const shortComment = `${faker.lorem.sentences(5)}`.slice(0, 150);
  const replyToCommentId = 6;

  test("clicking the 'Reply' button should toggle the comment reply form", async ({
    page,
  }) => {
    await page.locator(`#reply-button-for-comment-${replyToCommentId}`).click();
    await expect(page.locator(".comment-reply-form-display")).toBeVisible();

    await page.locator(`#reply-button-for-comment-${replyToCommentId}`).click();
    await expect(page.locator(".comment-reply-form-display")).not.toBeVisible();
  });

  test("it should save a new comment reply", async ({ page }) => {
    await page.locator(`#reply-button-for-comment-${replyToCommentId}`).click();
    await page
      .locator(`#add-comment-reply-${replyToCommentId}`)
      .fill(shortComment);
    await page.locator(`#post-reply-${replyToCommentId}`).click();
    await expect(page.locator("#comments-section-title")).toHaveText(
      `${startingCommentCount + 1} Comments`
    );
  });
});
