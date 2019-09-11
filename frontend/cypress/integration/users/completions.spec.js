/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

const fixtures = require("../../fixtures/users/completions.json")

Cypress.on("uncaught:exception", (err, runnable) => {
  return false
})

describe("user course completion", () => {
  it("is not admin", () => {
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

    cy.mockGraphQl("currentUser", fixtures.currentUserResult)
    cy.visit("/fi/users/12312323/completions")

    cy.get("input[name=email]").type("fake-user")
    cy.get("input[name=password").type("password")
    cy.getByTestId("login-button").click()

    cy.getByText("Sorry...")
  })

  it("is admin", () => {
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
    cy.mockGraphQl("currentUser", fixtures.currentUserResult)
    cy.mockGraphQl("user", fixtures.currentUserResult)

    cy.visit("/fi/users/12312323/completions")

    cy.get("input[name=email]").type("fake-user")
    cy.get("input[name=password]").type("password")
    cy.getByTestId("login-button").click()
  })
})
