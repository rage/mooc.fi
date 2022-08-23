import { gql } from "graphql-request"

import { fakeTMCCurrent, getTestContext } from "../../tests/__helpers"
import {
  adminUserDetails,
  normalUserDetails,
  thirdUserDetails,
} from "../../tests/data"
import { seed } from "../../tests/data/seed"
import { calculateActivationCode } from "../../util"

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

  describe("confirmUserOrganizationJoin", () => {
    it("errors if user is not associated with given confirmation id", async () => {
      return ctx.client
        .request(
          confirmUserOrganizationJoinMutation,
          {
            id: "61300000-0000-0000-0000-000000000001",
            code: "foo",
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
          confirmUserOrganizationJoinMutation,
          {
            id: "61300000-0000-0000-0000-000000000001",
            code: "foo",
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

    it("errors if confirmation has expired", async () => {
      await ctx.prisma.userOrganizationJoinConfirmation.update({
        where: {
          id: "61300000-0000-0000-0000-000000000001",
        },
        data: {
          confirmed: { set: false },
          expired: { set: true },
        },
      })

      return ctx.client
        .request(
          confirmUserOrganizationJoinMutation,
          {
            id: "61300000-0000-0000-0000-000000000001",
            code: "foo",
          },
          {
            Authorization: "Bearer normal",
          },
        )
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.errors?.[0]?.message).toContain(
            "confirmation link has expired",
          )
        })
    })

    it("errors if confirmation will expire now", async () => {
      await ctx.prisma.userOrganizationJoinConfirmation.update({
        where: {
          id: "61300000-0000-0000-0000-000000000001",
        },
        data: {
          confirmed: { set: false },
          expired: { set: false },
          expires_at: "1900-01-01T10:00:00.00+02:00",
        },
      })

      return ctx.client
        .request(
          confirmUserOrganizationJoinMutation,
          {
            id: "61300000-0000-0000-0000-000000000001",
            code: "foo",
          },
          {
            Authorization: "Bearer normal",
          },
        )
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.errors?.[0]?.message).toContain(
            "confirmation link has expired",
          )
        })
    })

    // not really applicable as confirmation is associated with user organization by default?
    // it("errors if user/organization relation is invalid")

    it("errors if activation code is invalid", async () => {
      await ctx.prisma.userOrganizationJoinConfirmation.update({
        where: {
          id: "61300000-0000-0000-0000-000000000001",
        },
        data: {
          confirmed: { set: false },
          expired: { set: false },
          expires_at: "2100-01-01T10:00:00.00+02:00",
        },
      })

      return ctx.client
        .request(
          confirmUserOrganizationJoinMutation,
          {
            id: "61300000-0000-0000-0000-000000000001",
            code: "foo",
          },
          {
            Authorization: "Bearer normal",
          },
        )
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.errors?.[0]?.message).toContain(
            "invalid activation code",
          )
        })
    })

    const confirmMembershipSuccessTest = async (authorization: string) => {
      const userOrganizationJoinConfirmation =
        await ctx.prisma.userOrganizationJoinConfirmation.update({
          where: {
            id: "61300000-0000-0000-0000-000000000001",
          },
          data: {
            confirmed: { set: false },
            expired: { set: false },
            expires_at: "2100-01-01T10:00:00.00+02:00",
          },
          include: {
            user_organization: {
              include: {
                organization: true,
                user: true,
              },
            },
          },
        })

      const activationCode = await calculateActivationCode({
        prisma: ctx.prisma,
        userOrganizationJoinConfirmation,
      })

      const before = new Date(Date.now())

      await ctx.client.request(
        confirmUserOrganizationJoinMutation,
        {
          id: "61300000-0000-0000-0000-000000000001",
          code: activationCode,
        },
        {
          Authorization: authorization,
        },
      )

      const updatedConfirmation =
        await ctx.prisma.userOrganizationJoinConfirmation.findUnique({
          where: { id: "61300000-0000-0000-0000-000000000001" },
          include: {
            user_organization: true,
          },
        })

      expect(updatedConfirmation!.confirmed).toEqual(true)
      expect(
        updatedConfirmation!.confirmed_at!.toLocaleDateString() >=
          before.toLocaleDateString(),
      ).toBe(true)
      expect(updatedConfirmation?.user_organization?.confirmed).toEqual(true)
    }

    it("confirms membership if all checks pass", async () => {
      await confirmMembershipSuccessTest("Bearer normal")
    })

    it("confirms membership with admin credentials", async () => {
      await confirmMembershipSuccessTest("Bearer admin")
    })
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

const confirmUserOrganizationJoinMutation = gql`
  mutation ConfirmUserOrganizationJoin($id: ID!, $code: String!) {
    confirmUserOrganizationJoin(id: $id, code: $code) {
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
        organizational_email
        organizational_identifier
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
