import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

import { seed } from "@/prisma/seed-test";
import { truncateDb } from "@/tests/helpers/truncate-db";

test.describe.configure({ mode: "serial" });

test.describe("Test accessibility of the Home page", () => {
  test("should not have any detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("/");
    expect(await page.textContent("body")).toContain("Feedback Board");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe("When visiting the app's base URL", () => {
  test.beforeAll(async () => {
    await truncateDb();
    await seed();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("it should render the category 'All' view", async ({ page }) => {
    const locator = page.getByRole("link", { name: "All", exact: true });
    await expect(locator).toBeVisible();
    await expect(locator).toHaveClass(/active/i);
    await expect(locator).toHaveAttribute("href", "/feedback/all");
    expect(page.url()).toContain("/feedback/all");
  });

  test("it should have a link to the Roadmap page", async ({ page }) => {
    const locator = page.getByRole("link", { name: "View", exact: true });

    await expect(locator).toBeVisible();
    await expect(locator).toHaveClass(/roadmap-view__link/i);
    await expect(locator).toHaveAttribute("href", "/roadmap");
  });

  test("it should list the Roadmap categories and their statistics", async ({
    page,
  }) => {
    const roadmapStats = [
      { category: "In Progress", slug: "in-progress", count: 3 },
      { category: "Planned", slug: "planned", count: 2 },
      { category: "Live", slug: "live", count: 1 },
    ];

    for (const stat of roadmapStats) {
      await expect(page.getByText(stat.category)).toBeVisible();
      await expect(page.locator(`[data-cy="${stat.slug}"]`)).toHaveText(
        String(stat.count)
      );
    }
  });

  test("it should have a button to add new Feedback", async ({ page }) => {
    const locator = page.getByRole("link", {
      name: "Add Feedback",
      exact: true,
    });

    await expect(locator).toBeVisible();
    await expect(locator).toHaveAttribute("href", "/feedback/new");
  });
});

test.describe("Sort suggestions", () => {
  const sortVotes = [
    {
      sortType: "Most Upvotes",
      first: 112,
      last: 3,
    },
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

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  /**
   * The following groups, use the list box to change the sort, validate that it
   * displays the currently active sort and validates the first and last suggestion
   * card have the correct vote or comment values.
   */
  for (const entry of sortVotes) {
    test(`by ${entry.sortType}`, async ({ page }) => {
      await page.getByLabel("Sort by :").getByText("Most Upvotes").click();
      await page.getByRole("option", { name: entry.sortType }).click();

      await expect(page.getByLabel("Sort by :")).toHaveText(entry.sortType);
      await expect(
        page.locator(
          ":nth-child(2) > .suggestion-card > .vote-container > .button"
        )
      ).toHaveText(String(entry.first));
      await expect(
        page.locator(
          ":nth-child(7) > .suggestion-card > .vote-container > .button"
        )
      ).toHaveText(String(entry.last));
    });
  }

  for (const entry of sortComments) {
    test(`by ${entry.sortType}`, async ({ page }) => {
      await page.getByLabel("Sort by :").getByText("Most Upvotes").click();
      await page.getByRole("option", { name: entry.sortType }).click();

      await expect(page.getByLabel("Sort by :")).toHaveText(entry.sortType);
      await expect(
        page.locator(
          ":nth-child(2) > .suggestion-card > .comment-info > .comment-count"
        )
      ).toHaveText(String(entry.first));
      await expect(
        page.locator(
          ":nth-child(7) > .suggestion-card > .comment-info > .comment-count"
        )
      ).toHaveText(String(entry.last));
    });
  }
});

test.describe("Filter suggestions by category", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  const categoryList = [
    { category: "All", count: 6 },
    { category: "UI", count: 0 },
    { category: "UX", count: 0 },
    { category: "Enhancement", count: 2 },
    { category: "Bug", count: 1 },
    { category: "Feature", count: 3 },
  ];

  for (const entry of categoryList) {
    test(`Category === ${entry.category}`, async ({ page }) => {
      await page
        .getByRole("link", { name: entry.category, exact: true })
        .click();

      await page.waitForURL(`**/${entry.category.toLowerCase()}`);

      expect(page.url()).toContain(`/feedback/${entry.category.toLowerCase()}`);

      const locator = page.getByRole("link", {
        name: entry.category,
        exact: true,
      });
      await expect(locator).toHaveClass(/active/i);

      if (entry.count === 0) {
        await expect(page.getByText(/there is no feedback yet/i)).toBeVisible();
      } else {
        expect(
          await page.locator("css=.suggestion-category").all()
        ).toHaveLength(entry.count);
      }
    });
  }
});
