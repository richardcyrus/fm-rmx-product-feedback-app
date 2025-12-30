import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Test accessibility of the Roadmap page", () => {
  test("should not have any detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("/roadmap");
    expect(await page.textContent("body")).toContain("Roadmap");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
