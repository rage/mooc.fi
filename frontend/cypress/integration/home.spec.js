/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

Cypress.on("uncaught:exception", (err, runnable) => {
  return false
})

describe("front page", () => {
  /*   it("/ loads and shows Finnish as default", () => {
    cy.visit("/")

    cy.get("h1").contains("Laadukkaita, avoimia ja ilmaisia verkkokursseja kaikille")
  })

  it("/en loads and shows English", () => {
    cy.visit("/en")

    cy.get("h1").contains("High-quality, open, and free courses for everyone!")
  })
 */
  describe("language switcher", () => {
    it("/ shows English and switches languages", () => {
      cy.visit("/")

      cy.getByTestId("language-switch").contains("English")
      cy.getByTestId("language-switch").click()

      cy.getByTestId("language-switch").contains("Suomi")
      cy.url().should("include", "/en/")
      cy.get("h1").contains(
        "High-quality, open, and free courses for everyone!",
      )
    })

    it("/en/ shows Suomi and switches languages", () => {
      cy.visit("/en/")

      cy.getByTestId("language-switch").contains("Suomi")
      cy.getByTestId("language-switch").click()

      cy.getByTestId("language-switch").contains("English")
      cy.url().should("not.include", "/en/")
      cy.url().should("not.include", "/fi/")
      cy.get("h1").contains(
        "Laadukkaita, avoimia ja ilmaisia verkkokursseja kaikille",
      )
    })
  })
})
