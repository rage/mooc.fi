/*
/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

Cypress.on("uncaught:exception", (err, runnable) => {
  return false
})

describe("login", () => {
  it("logs in with ok credentials", () => {
    cy.mockTmc({ accessToken: "fake-token", details: "asdfasdf" })

    cy.visit("/")
    cy.getByText("Kirjaudu sisään").click()
    cy.url().should("include", "/fi/sign-in")

    cy.getByTestId("login-button").should("be.disabled")
    cy.get("input[name=email]").type("ok.user")
    cy.getByTestId("login-button").should("be.disabled")
    cy.get("input[name=password]").type("password")
    cy.getByTestId("login-button").should("not.be.disabled")
    cy.getByTestId("login-button").click()
  })
})
*/
