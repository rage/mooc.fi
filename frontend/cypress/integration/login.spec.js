/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

Cypress.on("uncaught:exception", (err, runnable) => {
  return false
})

describe("login", () => {
  it("logs in with ok credentials", () => {
    cy.visit("/")
    cy.getByText("Kirjaudu sisään").click()
    cy.url().should("include", "/fi/sign-in")

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
        data: "ok-data",
      },
    })

    cy.getByTestId("login-button").should("be.disabled")
    cy.get("input[name=email]").type("ok.user")
    cy.getByTestId("login-button").should("be.disabled")
    cy.get("input[name=password]").type("password")
    cy.getByTestId("login-button").should("not.be.disabled")
    cy.getByTestId("login-button").click()
  })
})
