export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Reset the Prisma database between tests.
       *
       * @returns {typeof resetDb}
       * @memberof Chainable
       * @example
       *  cy.resetDb()
       */
      resetDb: typeof resetDb;
      seedDb: typeof seedDb;
    }
  }
}

function resetDb() {
  return cy.task("resetDb");
}

function seedDb() {
  return cy.task("seedDatabase");
}

Cypress.Commands.add("resetDb", resetDb);
Cypress.Commands.add("seedDb", seedDb);

// the below code snippet is required to handle a React hydration bug that
// would cause tests to fail. It's only a workaround until this React
// behavior / bug is fixed
Cypress.on("uncaught:exception", (err) => {
  // we check if the error is
  if (
    err.message.includes("Minified React error #418;") ||
    err.message.includes("Minified React error #423;") ||
    err.message.includes("hydrating") ||
    err.message.includes("Hydration")
  ) {
    return false;
  }
});

/*
eslint
  @typescript-eslint/no-namespace: "off",
*/
