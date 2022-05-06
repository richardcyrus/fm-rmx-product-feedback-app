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
    }
  }
}

function resetDb() {
  return cy.task("resetDb");
}

Cypress.Commands.add("resetDb", resetDb);

/*
eslint
  @typescript-eslint/no-namespace: "off",
*/
