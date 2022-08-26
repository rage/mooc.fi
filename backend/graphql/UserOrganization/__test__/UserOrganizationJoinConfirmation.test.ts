import { gql } from "graphql-request"

import { fakeTMCCurrent, getTestContext } from "../../../tests/__helpers"
import {
  adminUserDetails,
  normalUserDetails,
  thirdUserDetails,
} from "../../../tests/data"
import { seed } from "../../../tests/data/seed"

const ctx = getTestContext()
const tmc = fakeTMCCurrent({
  "Bearer normal": [200, normalUserDetails],
  "Bearer admin": [200, adminUserDetails],
  "Bearer third": [200, thirdUserDetails],
})

describe("UserOrganizationJoinConfirmation", () => {
  beforeEach(async () => {
    await seed(ctx.prisma)
    tmc.setup()
  })

  afterAll(() => {
    tmc.teardown()
  })

  describe("refreshUserOrganizationJoinConfirmation", () => {
    it("errors if user is not associated with given confirmation id with normal user", async () => {
      return ctx.client
        .request(
          refreshUserOrganizationJoinConfirmationMutation,
          {
            id: "61300000-0000-0000-0000-000000000001",
          },
          {
            Authorization: "Bearer third",
          },
        )
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.errors?.[0]?.message).toContain(
            "invalid confirmation id",
          )
        })
    })

    it("errors if membership has already been confirmed", async () => {
      return ctx.client
        .request(
          refreshUserOrganizationJoinConfirmationMutation,
          {
            id: "61300000-0000-0000-0000-000000000001",
          },
          {
            Authorization: "Bearer normal",
          },
        )
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.errors?.[0]?.message).toContain(
            "this user organization membership has already been confirmed",
          )
        })
    })

    // TODO
    // - refresh success on admin
    /*it("will update the confirmation if all checks pass, updating possible unsent email deliveries")*/
  })
})

const refreshUserOrganizationJoinConfirmationMutation = gql`
  mutation RefreshUserOrganizationJoinConfirmation(
    $id: ID!
    $organizational_email: String
    $redirect: String
    $language: String
  ) {
    refreshUserOrganizationJoinConfirmation(
      id: $id
      organizational_email: $organizational_email
      redirect: $redirect
      language: $language
    ) {
      id
      email
      language
      redirect
      confirmed
      confirmed_at
      expired
      expires_at
      email_delivery_id
      email_delivery {
        id
        email
        error
        error_message
        sent
      }
      user_organization_id
      user_organization {
        id
        organization {
          id
          slug
        }
        user {
          id
          upstream_id
        }
        role
        confirmed
        confirmed_at
        consented
      }
    }
  }
`
