/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

const fixtures = require("../../fixtures/users/completions.json")

Cypress.on("uncaught:exception", (err, runnable) => {
  return false
})

describe("user course completion", () => {
  describe("is not admin", () => {
    it("shows error", () => {
      cy.server()
      cy.route({
        method: "POST",
        url: "https://tmc.mooc.fi/oauth/token",
        response: {
          accessToken: "fake-token",
        },
      })
      cy.route({
        method: "GET",
        url: "https://tmc.mooc.fi/api/v8/users/current?show_user_fields=true",
        response: {
          administrator: false,
        },
      })

      cy.mockGraphQl("currentUser", fixtures.notRegistered.currentUserResult)
      cy.visit("/fi/users/12312323/completions")

      cy.get("input[name=email]").type("fake-user")
      cy.get("input[name=password").type("password")
      cy.getByTestId("login-button").click()

      cy.url().should("contain", "/fi/users/12312323/completions")
      cy.getByText("Sorry...")
    })
  })

  describe("is admin", () => {
    beforeEach(() => {
      cy.server()
      cy.route({
        method: "POST",
        url: "https://tmc.mooc.fi/oauth/token",
        response: {
          accessToken: "fake-token",
        },
      })
      cy.route({
        method: "GET",
        url: "https://tmc.mooc.fi/api/v8/users/current?show_user_fields=true",
        response: {
          administrator: "true",
          email: "fake@email.com",
          first_name: "fake",
          last_name: "user",
          username: "fake-user",
        },
      })
    })

    it("has no registered completion", () => {
      cy.mockGraphQl("currentUser", fixtures.notRegistered.currentUserResult)
      cy.mockGraphQl("user", fixtures.notRegistered.currentUserResult)

      cy.visit("/fi/users/12312323/completions")

      cy.get("input[name=email]").type("fake-user")
      cy.get("input[name=password]").type("password")
      cy.getByTestId("login-button").click()

      cy.url().should("contain", "/fi/users/12312323/completions")

      fixtures.notRegistered.texts.forEach(text => cy.getByText(text))
    })

    it("has a registered completion", () => {
      cy.mockGraphQl("currentUser", fixtures.registered.currentUserResult)
      cy.mockGraphQl("user", fixtures.registered.currentUserResult)

      cy.visit("/fi/users/12312323/completions")

      cy.get("input[name=email]").type("fake-user")
      cy.get("input[name=password]").type("password")
      cy.getByTestId("login-button").click()

      cy.url().should("contain", "/fi/users/12312323/completions")
      fixtures.registered.texts.forEach(text => cy.getByText(text))
    })
  })
})
