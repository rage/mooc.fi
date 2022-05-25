import { gql } from "graphql-request"

import { fakeTMCCurrent, getTestContext } from "../../tests/__helpers"
import { adminUserDetails, normalUserDetails } from "../../tests/data"
import { seed } from "../../tests/data/seed"

const ctx = getTestContext()
const tmc = fakeTMCCurrent({
  "Bearer normal": [200, normalUserDetails],
  "Bearer admin": [200, adminUserDetails],
})

describe("UserOrganization", () => {
  beforeEach(async () => {
    await seed(ctx.prisma)
  })

  describe("mutations", () => {
    beforeEach(async () => {
      tmc.setup()
    })

    afterAll(() => {
      tmc.teardown()
    })

    describe("addUserOrganization", () => {
      it("errors if user_id provided on normal user credentials", async () => {
        return ctx.client
          .request(
            addUserOrganizationMutation,
            {
              user_id: "20000000000000000000000000000103",
              organization_id: "10000000000000000000000000000102",
            },
            {
              Authorization: "Bearer normal",
            },
          )
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.errors?.[0]?.message).toContain(
              "invalid credentials",
            )
          })
      })

      it("errors if user doesn't exist", async () => {
        return ctx.client
          .request(
            addUserOrganizationMutation,
            {
              user_id: "20000000000000000000000000000999",
              organization_id: "10000000000000000000000000000102",
            },
            {
              Authorization: "Bearer admin",
            },
          )
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.errors?.[0]?.message).toContain("no such user")
          })
      })

      it("errors if organization doesn't exist", async () => {
        return ctx.client
          .request(
            addUserOrganizationMutation,
            {
              organization_id: "10000000000000000000000000000999",
            },
            {
              Authorization: "Bearer normal",
            },
          )
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.errors?.[0]?.message).toContain(
              "no such organization",
            )
          })
      })

      it("errors if user is already a member of the organization", async () => {
        return ctx.client
          .request(
            addUserOrganizationMutation,
            {
              organization_id: "10000000000000000000000000000103",
            },
            {
              Authorization: "Bearer normal",
            },
          )
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.errors?.[0]?.message).toContain(
              "this user/organization relation already exists",
            )
          })
      })

      it("adds user to organization if organization does not require confirmation", async () => {
        const { addUserOrganization } = await ctx.client.request(
          addUserOrganizationMutation,
          {
            organization_id: "10000000000000000000000000000103",
          },
          {
            Authorization: "Bearer admin",
          },
        )

        expect(addUserOrganization?.user_id).toEqual(
          "20000000-0000-0000-0000-000000000103",
        )
        expect(addUserOrganization?.confirmed).toEqual(true)
        expect(addUserOrganization?.organization?.id).toEqual(
          "10000000-0000-0000-0000-000000000103",
        )
      })

      it("creates an user organization join confirmation and an email delivery if organization requires confirmation", async () => {
        const { addUserOrganization } = await ctx.client.request(
          addUserOrganizationMutation,
          {
            organization_id: "10000000000000000000000000000104",
          },
          {
            Authorization: "Bearer normal",
          },
        )

        expect(addUserOrganization?.user_id).toEqual(
          "20000000-0000-0000-0000-000000000102",
        )
        expect(addUserOrganization?.confirmed).toEqual(false)
        expect(addUserOrganization?.organization?.id).toEqual(
          "10000000-0000-0000-0000-000000000104",
        )

        expect(
          addUserOrganization?.user_organization_join_confirmations?.[0]
            ?.confirmed,
        ).toEqual(false)
        expect(
          addUserOrganization?.user_organization_join_confirmations?.[0]
            ?.email_delivery?.email_template?.name,
        ).toEqual("organization join email")
      })

      it("creates an user organization join confirmation and an email delivery if organization requires confirmation and correct organizational email provided", async () => {
        const { addUserOrganization } = await ctx.client.request(
          addUserOrganizationMutation,
          {
            organization_id: "10000000000000000000000000000102",
            email: "user@organization.fi",
          },
          {
            Authorization: "Bearer admin",
          },
        )

        expect(addUserOrganization?.user_id).toEqual(
          "20000000-0000-0000-0000-000000000103",
        )
        expect(addUserOrganization?.confirmed).toEqual(false)
        expect(addUserOrganization?.organization?.id).toEqual(
          "10000000-0000-0000-0000-000000000102",
        )

        expect(
          addUserOrganization?.user_organization_join_confirmations?.[0]
            ?.confirmed,
        ).toEqual(false)
        expect(
          addUserOrganization?.user_organization_join_confirmations?.[0]
            ?.email_delivery?.email,
        ).toEqual("user@organization.fi")
        expect(
          addUserOrganization?.user_organization_join_confirmations?.[0]
            ?.email_delivery?.email_template?.name,
        ).toEqual("organization join email")
      })

      it("errors if user email does not match organization email", async () => {
        return ctx.client
          .request(
            addUserOrganizationMutation,
            {
              organization_id: "10000000000000000000000000000102",
            },
            {
              Authorization: "Bearer admin",
            },
          )
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.errors?.[0]?.message).toContain(
              "user email does not match organization email",
            )
          })
      })
    })
  })
})

const addUserOrganizationMutation = gql`
  mutation AddUserOrganization(
    $user_id: ID
    $organization_id: ID!
    $email: String
    $redirect: String
    $language: String
  ) {
    addUserOrganization(
      user_id: $user_id
      organization_id: $organization_id
      email: $email
      redirect: $redirect
      language: $language
    ) {
      id
      organization {
        id
        slug
      }
      role
      user_id
      confirmed
      confirmed_at
      user_organization_join_confirmations {
        id
        email
        redirect
        language
        confirmed
        confirmed_at
        email_delivery {
          id
          email
          email_template {
            id
            name
          }
        }
      }
    }
  }
`
