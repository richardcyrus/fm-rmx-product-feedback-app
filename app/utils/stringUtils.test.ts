import { toTitleCase } from "~/utils/stringUtils";

describe("Converts a string to `Title Case`", () => {
  it("should convert a `snake_case` string", () => {
    expect(toTitleCase("some_database_field_name")).toBe(
      "Some Database Field Name"
    );
  });

  it("should convert a `kebab-case` string", () => {
    expect(toTitleCase("some-package-name")).toBe("Some Package Name");
  });

  it("should convert a `mixed space and kebab-case` string", () => {
    expect(toTitleCase("Some label that needs to be title-cased")).toBe(
      "Some Label That Needs To Be Title Cased"
    );
  });

  it("should convert a mixed string", () => {
    expect(
      toTitleCase("some-mixed_string with spaces_underscores-and-hyphens")
    ).toBe("Some Mixed String With Spaces Underscores And Hyphens");
  });
});
