/*
/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

const fixtures = require("../fixtures/register-completion/data.json")

Cypress.on("uncaught:exception", (err, runnable) => {
  return false
})

describe("register completion", () => {
  describe("not logged in", () => {
    it("redirects to log in", () => {
      cy.visit("/register-completion/elements-of-ai")
      cy.url().should("include", "/fi/sign-in")
    })
  })

  describe("logged in", () => {
    beforeEach(() => {
      cy.mockTmc({
        accessToken: "asdf",
        details: {
          administrator: "false",
          email: "fake@email.com",
          first_name: "fake",
          last_name: "user",
          username: "fake-user",
        },
      })
    })

    describe("shows correct completion", () => {
      before(() => {
        cy.mockGraphQl({
          query: "currentUser",
          result: fixtures.loggedInCompletion.currentUserResult,
        })
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

      after(() => cy.signOut())

      fixtures.loggedInCompletion.tests.forEach((test) =>
        it(`path ${test.pathSlug}`, () => {
          cy.visit(`${test.pathSlug}register-completion/course1`)

          test.texts.forEach((text) => cy.getByText(text))
        }),
      )
    })
  })
})
*/
