import { gql } from "graphql-request"

import { fakeTMCCurrent, getTestContext } from "../../../tests/__helpers"
import {
  adminUserDetails,
  normalUserDetails,
  thirdUserDetails,
} from "../../../tests/data"
import { seed } from "../../../tests/data/seed"
import { calculateActivationCode } from "../../../util"

const ctx = getTestContext()
const tmc = fakeTMCCurrent({
  "Bearer normal": [200, normalUserDetails],
  "Bearer admin": [200, adminUserDetails],
  "Bearer third": [200, thirdUserDetails],
})

const CONFIRMATION_ID = "61300000-0000-0000-0000-000000000001"

type AsyncFunction<A extends readonly any[] = readonly any[], R = unknown> = (
  ...args: A
) => Promise<R>
type ErrorCase = {
  title: string
  message: string
  args?: Record<string, any>
  headers?: HeadersInit
  before?: Function | AsyncFunction
}

describe("UserOrganization", () => {
  beforeEach(async () => {
    await seed(ctx.prisma)
    tmc.setup()
  })

  afterAll(() => {
    tmc.teardown()
  })

  describe("mutations", () => {
    const errorCases: Array<ErrorCase> = [
      {
        title: "if user_id provided on normal user credentials",
        args: {
          user_id: "20000000000000000000000000000103",
          organization_id: "10000000000000000000000000000102",
        },
        headers: {
          Authorization: "Bearer normal",
        },
        message: "invalid credentials to do that",
      },
      {
        title: "if user doesn't exist",
        args: {
          user_id: "20000000000000000000000000000999",
          organization_id: "10000000000000000000000000000102",
        },
        headers: {
          Authorization: "Bearer admin",
        },
        message: "no such user",
      },
      {
        title: "if organization doesn't exist when organization_id provided",
        args: {
          user_id: "20000000000000000000000000000103",
          organization_id: "10000000000000000000000000000999",
        },
        headers: {
          Authorization: "Bearer admin",
        },
        message: "no such organization",
      },
      {
        title: "if organization doesn't exist when organization_slug provided",
        args: {
          user_id: "20000000000000000000000000000103",
          organization_slug: "foofoo",
        },
        headers: {
          Authorization: "Bearer admin",
        },
        message: "no such organization",
      },
      {
        title: "if neither organization_id nor organization_slug provided",
        headers: {
          Authorization: "Bearer normal",
        },
        message: "no organization_id nor organization_slug provided",
      },
      {
        title: "if user is already a member of the organization",
        args: {
          organization_id: "10000000000000000000000000000103",
        },
        headers: {
          Authorization: "Bearer normal",
        },
        message: "this user/organization relation already exists",
      },
      {
        title:
          "if join requires organizational email and user email does not match",
        args: {
          organization_id: "10000000000000000000000000000102",
        },
        headers: {
          Authorization: "Bearer admin",
        },
        message: "given email does not fulfill organization email requirements",
      },
      {
        title:
          "if join requires organizational email and given organizational email does not match",
        args: {
          organization_id: "10000000000000000000000000000102",
          organizational_email: "foo@foo.foo",
        },
        headers: {
          Authorization: "Bearer admin",
        },
        message: "given email does not fulfill organization email requirements",
      },
    ]

    describe.skip("addUserOrganization", () => {
      describe("errors", () => {
        it.each(errorCases)("$title", async ({ args, headers, message }) => {
          try {
            await ctx.client.request(addUserOrganizationMutation, args, headers)
            fail()
          } catch (e: any) {
            expect(e.response.errors[0].message).toEqual(message)
          }
        })
      })

      describe("succeeds", () => {
        describe("with no confirmation required", () => {
          it("adding user to organization", async () => {
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
        })

        describe("with confirmation required", () => {
          it("creating a user organization join confirmation and an email delivery", async () => {
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

          it("creating a user organization join confirmation and an email delivery and user email matches required organizational email", async () => {
            const { addUserOrganization } = await ctx.client.request(
              addUserOrganizationMutation,
              {
                organization_id: "10000000000000000000000000000102",
              },
              {
                Authorization: "Bearer third",
              },
            )

            expect(addUserOrganization?.user_id).toEqual(
              "20000000-0000-0000-0000-000000000104",
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
            ).toEqual("third@organization.fi")
            expect(
              addUserOrganization?.user_organization_join_confirmations?.[0]
                ?.email_delivery?.email_template?.name,
            ).toEqual("organization join email")
          })

          it("creating a user organization join confirmation and an email delivery and correct required organizational email provided", async () => {
            const { addUserOrganization } = await ctx.client.request(
              addUserOrganizationMutation,
              {
                organization_id: "10000000000000000000000000000102",
                organizational_email: "user@organization.fi",
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
        })
      })
    })

    describe("confirmUserOrganizationJoin", () => {
      const errorCases: Array<ErrorCase> = [
        {
          title: "if user is not associated with given confirmation id",
          args: {
            id: CONFIRMATION_ID,
            code: "foo",
          },
          headers: {
            Authorization: "Bearer third",
          },
          message: "invalid confirmation id",
        },
        {
          title: "if membership has already been confirmed",
          args: {
            id: CONFIRMATION_ID,
            code: "foo",
          },
          headers: {
            Authorization: "Bearer normal",
          },
          message:
            "this user organization membership has already been confirmed",
        },
        {
          title: "errors if confirmation has expired",
          args: {
            id: CONFIRMATION_ID,
            code: "foo",
          },
          headers: {
            Authorization: "Bearer normal",
          },
          message: "confirmation link has expired",
          before: async () =>
            ctx.prisma.userOrganizationJoinConfirmation.update({
              where: {
                id: CONFIRMATION_ID,
              },
              data: {
                confirmed: { set: false },
                expired: { set: true },
                user_organization: {
                  update: {
                    confirmed: { set: false },
                  },
                },
              },
            }),
        },
        {
          title: "if confirmation will expire now",
          args: {
            id: CONFIRMATION_ID,
            code: "foo",
          },
          headers: {
            Authorization: "Bearer normal",
          },
          message: "confirmation link has expired",
          before: async () =>
            ctx.prisma.userOrganizationJoinConfirmation.update({
              where: {
                id: CONFIRMATION_ID,
              },
              data: {
                confirmed: { set: false },
                expired: { set: false },
                expires_at: "1900-01-01T10:00:00.00+02:00",
                user_organization: {
                  update: {
                    confirmed: { set: false },
                  },
                },
              },
            }),
        },
        {
          title: "if activation code is invalid",
          args: {
            id: CONFIRMATION_ID,
            code: "foo",
          },
          headers: {
            Authorization: "Bearer normal",
          },
          message: "invalid activation code",
          before: async () =>
            ctx.prisma.userOrganizationJoinConfirmation.update({
              where: {
                id: CONFIRMATION_ID,
              },
              data: {
                confirmed: { set: false },
                expired: { set: false },
                expires_at: "2100-01-01T10:00:00.00+02:00",
                user_organization: {
                  update: {
                    confirmed: { set: false },
                  },
                },
              },
            }),
        },
      ]

      describe("errors", () => {
        it.each(errorCases)(
          "$title",
          async ({ args, headers, message, before }) => {
            try {
              if (before) {
                await before()
              }
              await ctx.client.request(
                confirmUserOrganizationJoinMutation,
                args,
                headers,
              )
              fail()
            } catch (e: any) {
              expect(e.response.errors[0].message).toEqual(message)
            }
          },
        )
      })

      const confirmMembershipSuccessTest = async (authorization: string) => {
        const userOrganizationJoinConfirmation =
          await ctx.prisma.userOrganizationJoinConfirmation.update({
            where: {
              id: CONFIRMATION_ID,
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
            id: CONFIRMATION_ID,
            code: activationCode,
          },
          {
            Authorization: authorization,
          },
        )

        const updatedConfirmation =
          await ctx.prisma.userOrganizationJoinConfirmation.findUnique({
            where: { id: CONFIRMATION_ID },
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
  })
})

const addUserOrganizationMutation = gql`
  mutation AddUserOrganization(
    $user_id: ID
    $organization_id: ID
    $organization_slug: String
    $organizational_email: String
    $organizational_identifier: String
    $redirect: String
    $language: String
  ) {
    addUserOrganization(
      user_id: $user_id
      organization_id: $organization_id
      organization_slug: $organization_slug
      organizational_email: $organizational_email
      organizational_identifier: $organizational_identifier
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
      organizational_email
      organizational_identifier
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

const confirmUserOrganizationJoinMutation = gql`
  mutation ConfirmUserOrganizationJoin($id: ID!, $code: String!) {
    confirmUserOrganizationJoin(id: $id, code: $code) {
      id
      organization {
        id
        slug
      }
      role
      user_id
      organizational_email
      organizational_identifier
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
