import AxeBuilder from "@axe-core/playwright";
import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";

import { seed } from "@/prisma/seed-test";
import { truncateDb } from "@/tests/helpers/truncate-db";

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  await truncateDb();
  await seed();
});

test.describe("Test accessibility of the New Feedback page", () => {
  test("should not have any detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("/feedback/new");
    expect(await page.textContent("body")).toContain("Create New Feedback");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe("Create new feedback", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/feedback/new");
  });

  const newFeedback = {
    title: `${faker.hacker.phrase()}`.slice(0, 50),
    category: "Enhancement",
    description: `${faker.lorem.sentences(8)}`.slice(0, 250),
  };

  test("it should fail validation with empty submission", async ({ page }) => {
    await page.getByRole("button", { name: /add feedback/i }).click();

    await expect(page.locator("#title-error")).toContainText("Can't be empty");
    await expect(page.locator("#description-error")).toContainText(
      "Can't be empty"
    );
  });

  test("it should fail validation on empty title", async ({ page }) => {
    await page.getByLabel(/category/i).click();
    await page.getByRole("option", { name: newFeedback.category }).click();
    await page.getByLabel(/feedback detail/i).fill(newFeedback.description);
    await page.getByRole("button", { name: /add feedback/i }).click();

    await expect(page.locator("#title-error")).toContainText("Can't be empty");
  });

  test("it should fail validation on empty description", async ({ page }) => {
    await page.getByLabel(/feedback title/i).type(newFeedback.title);
    await page.getByLabel(/category/i).click();
    await page.getByRole("option", { name: newFeedback.category }).click();
    await page.getByRole("button", { name: /add feedback/i }).click();

    await expect(page.locator("#description-error")).toContainText(
      "Can't be empty"
    );
  });

  test("it should allow to cancel create on empty submission", async ({
    page,
  }) => {
    await page
      .getByRole("button", {
        name: /Cancel/i,
      })
      .click();

    await page.waitForURL("**/feedback/all");

    expect(page.url()).toContain("/feedback/all");
  });

  test("it should allow to new create feedback", async ({ page }) => {
    await page.getByLabel(/feedback title/i).fill(newFeedback.title);
    await page.getByLabel(/category/i).click();
    await page.getByRole("option", { name: newFeedback.category }).click();
    await page.getByLabel(/feedback detail/i).fill(newFeedback.description);
    await page.getByRole("button", { name: /add feedback/i }).click();

    await page.waitForURL("**/feedback/view/*");

    expect(page.url()).not.toContain("/feedback/new");
    expect(page.url()).toContain("/feedback/view");
  });
});
