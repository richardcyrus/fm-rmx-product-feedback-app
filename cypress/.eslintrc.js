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
    "testing-library/await-async-query": OFF,
    "testing-library/await-async-utils": OFF,
    "testing-library/no-await-sync-events": OFF,
    "testing-library/no-await-sync-query": OFF,
    "testing-library/no-debugging-utils": OFF,
    "testing-library/no-promise-in-fire-event": OFF,
    "testing-library/no-render-in-setup": OFF,
    "testing-library/no-unnecessary-act": OFF,
    "testing-library/no-wait-for-empty-callback": OFF,
    "testing-library/no-wait-for-multiple-assertions": OFF,
    "testing-library/no-wait-for-side-effects": OFF,
    "testing-library/no-wait-for-snapshot": OFF,
    "testing-library/prefer-find-by": OFF,
    "testing-library/prefer-presence-queries": OFF,
    "testing-library/prefer-query-by-disappearance": OFF,
    "testing-library/prefer-screen-queries": OFF,
    "testing-library/prefer-user-event": OFF,
    "testing-library/prefer-wait-for": OFF,
    "testing-library/render-result-naming-convention": OFF,
  },
};
