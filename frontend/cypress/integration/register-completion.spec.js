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
      cy.server()
      cy.route({
        method: "POST",
        url: "https://tmc.mooc.fi/oauth/token",
        response: {
          access_token: "asdfasdfsadf",
        },
      })
      cy.route({
        method: "GET",
        url: "https://tmc.mooc.fi/api/v8/users/current?show_user_fields=true",
        response: {
          data: {
            administrator: false,
            email: "fake@email.com",
            first_name: "fake",
            last_name: "user",
            username: "fake-user",
          },
        },
      })
    })

    describe("shows correct completion", () => {
      before(() => {
        cy.mockGraphQl(
          "currentUser",
          fixtures.loggedInCompletion.currentUserResult,
        )
      })

      fixtures.loggedInCompletion.tests.forEach(test =>
        it(`path ${test.pathSlug}`, () => {
          cy.visit(`${test.pathSlug}register-completion/course1`)
          cy.url().should("contain", `/${test.slug}/sign-in`)
          cy.get("input[name=email]").type("fake-user")
          cy.get("input[name=password").type("password")
          cy.getByTestId("login-button").click()

          cy.url().should(
            "contain",
            `/${test.slug}/register-completion/course1`,
          )

          test.texts.forEach(text => cy.getByText(text))
        }),
      )
    })
  })
})
