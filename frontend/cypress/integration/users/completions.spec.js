/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

Cypress.on("uncaught:exception", (err, runnable) => {
  return false
})

describe("user course completion", () => {})
