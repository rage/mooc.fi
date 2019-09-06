/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

const fixtures = require("../fixtures/register-completion/data.json")

Cypress.on("uncaught:exception", (err, runnable) => {
  return false
})

describe("register completion", () => {
  /*   describe("not logged in", () => {
    it("redirects to log in", () => {
      cy.visit("/register-completion/elements-of-ai")
      cy.url().should("include", "/fi/sign-in")
    })
  })

 */

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

    /*     describe("shows completion not found with no completion", () => {
      before(() => {
        cy.mockGraphQl(
          "currentUser",
          fixtures.loggedInNoCompletion.currentUserResult,
        )
      })

      fixtures.loggedInNoCompletion.tests.forEach(test =>
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
    }) */

    describe("shows correct completion", () => {
      before(() => {
        cy.mockGraphQl(
          "currentUser",
          fixtures.loggedInCompletion.currentUserResult,
        )
      })

      // TODO: can't have completions in different languages
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

    /*     it("shows correct completion", () => {
      cy.mockGraphQl("currentUser", {
        id: "123123",
        upstream_id: "12312323",
        first_name: "fake",
        last_name: "user",
        email: "fake@email.com",
        completions: [
          {
            id: "coursecompletion1",
            completion_language: "en_US",
            completion_link: "what",
            student_number: "123123",
            course: {
              id: "course1",
              slug: "course1",
              name: "course 1",
            },
            completions_registered: [
              {
                id: "complreg1",
                organization: {
                  slug: "org",
                },
              },
            ],
          },
        ],
      })

      cy.visit("/register-completion/course1")
      cy.url().should("contain", "/fi/sign-in")
      cy.get("input[name=email]").type("fake-user")
      cy.get("input[name=password").type("password")
      cy.getByTestId("login-button").click()

      cy.url().should("contain", "/fi/register-completion/course1")

      cy.getByText(
        "Opintopisteiden Rekisteröinti"
      )
    }) 
  })*/
  })
})
