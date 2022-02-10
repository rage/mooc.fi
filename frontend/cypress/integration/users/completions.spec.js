/*/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

const fixtures = require("../../fixtures/users/completions.json")

Cypress.on("uncaught:exception", (err, runnable) => {
  return false
})

describe("user course completion", () => {
  describe("is admin", () => {
    beforeEach(() => {
      cy.signIn({
        accessToken: "fake",
        details: {
          administrator: "true",
          email: "fake@email.com",
          first_name: "fake",
          last_name: "user",
          username: "fake-user",
        },
      })
    })

    afterEach(() => cy.signOut())

    it("has no registered completion", () => {
      cy.mockGraphQl([
        {
          query: "currentUser",
          result: fixtures.notRegistered.currentUserResult,
        },
        { query: "user", result: fixtures.notRegistered.currentUserResult },
      ])

      cy.visit("/fi/users/12312323/completions")
      fixtures.notRegistered.texts.forEach((text) => cy.getByText(text))
    })

    it("has a registered completion", () => {
      cy.mockGraphQl([
        { query: "currentUser", result: fixtures.registered.currentUserResult },
        { query: "user", result: fixtures.registered.currentUserResult },
      ])

      cy.visit("/fi/users/12312323/completions")
      fixtures.registered.texts.forEach((text) => cy.getByText(text))
    })

    afterEach(() => cy.signOut())
  })

  describe("is not admin", () => {
    it("shows error", () => {
      cy.signIn({
        accessToken: "fake",
        details: {
          administrator: "false",
          email: "fake@email.com",
          first_name: "fake",
          last_name: "user",
          username: "fake-user",
        },
      })

      cy.mockTmc({ accessToken: "fake", details: { administrator: "false" } })
      cy.mockGraphQl({
        query: "currentUser",
        result: fixtures.notRegistered.currentUserResult,
      })

      cy.visit("/fi/users/12312323/completions")

      cy.getByText("Sorry...")

      cy.signOut()
    })
  })
})
*/
