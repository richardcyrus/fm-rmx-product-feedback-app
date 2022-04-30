/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "plugin:prettier/recommended",
  ],
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
      },
    ],
    "import/prefer-default-export": 0,
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal"],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "react/jsx-props-no-spreading": [
      "error",
      {
        exceptions: ["svg"],
      },
    ],
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "function-declaration",
      },
    ],
    "prettier/prettier": "error",
  },
  // we're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but we have to explicitly
  // set the jest version.
  settings: {
    jest: {
      version: 27,
    },
  },
};
