const OFF = 0;
// const WARN = 1;
// const ERROR = 2;

module.exports = {
  env: {
    "jest/globals": false,
  },
  extends: ["plugin:chai-friendly/recommended", "plugin:cypress/recommended"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  rules: {
    "jest/no-conditional-expect": OFF,
    "jest/no-deprecated-functions": OFF,
    "jest/no-disabled-tests": OFF,
    "jest/no-export": OFF,
    "jest/no-focused-tests": OFF,
    "jest/no-identical-title": OFF,
    "jest/no-interpolation-in-snapshots": OFF,
    "jest/no-jasmine-globals": OFF,
    "jest/no-jest-import": OFF,
    "jest/no-mocks-import": OFF,
    "jest/valid-describe-callback": OFF,
    "jest/valid-expect": OFF,
    "jest/valid-expect-in-promise": OFF,
  },
};
