// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
/*import "@testing-library/cypress/add-commands"
import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command"

const mockGraphQl = ({ query, result, variables }) =>
  cy.request({
    url: "http://localhost:4001/mock",
    method: "POST",
    body: {
      query,
      result,
      variables,
    },
    options: { headers: { "Content-Type": "application/json" } },
  })

Cypress.Commands.add("mockGraphQl", (params) => {
  if (Array.isArray(params)) {
    Promise.all(params.map((p) => mockGraphQl(p)))
  } else {
    mockGraphQl(params)
  }
})

Cypress.Commands.add("mockTmc", ({ accessToken, details }) => {
  cy.server()
  cy.route({
    method: "POST",
    url: "https://tmc.mooc.fi/oauth/token",
    response: {
      accessToken,
    },
  })
  cy.route({
    method: "GET",
    url: "https://tmc.mooc.fi/api/v8/users/current?show_user_fields=true",
    response: details,
  })
})

Cypress.Commands.add("signIn", ({ accessToken, details }) => {
  cy.request({
    url: "http://localhost:4001/signin",
    method: "POST",
    body: {
      accessToken,
      details,
    },
    options: { headers: { "Content-Type": "application/json" } },
  })
})

Cypress.Commands.add("signOut", () =>
  cy.request({ url: "http://localhost:4001/signout", method: "POST" }),
)

addMatchImageSnapshotCommand()*/
