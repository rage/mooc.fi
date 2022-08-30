import { gql } from "graphql-request"

import {
  EmailDelivery,
  EmailTemplate,
  Organization,
  User,
  UserOrganization,
  UserOrganizationJoinConfirmation,
} from "@prisma/client"

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

const DateRegExp = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/)

describe("UserOrganization", () => {
  beforeAll(() => {
    jest.spyOn(Date, "now").mockImplementation(() => 1640995200000) // 2022-01-01
  })
  beforeEach(async () => {
    await seed(ctx.prisma)

    tmc.setup()
  })

  afterAll(() => {
    tmc.teardown()
    // @ts-ignore: mocked
    Date.now.mockRestore()
  })

  describe("mutations", () => {
    describe("addUserOrganization", () => {
      describe("errors", () => {
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
            title:
              "if organization doesn't exist when organization_id provided",
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
            title:
              "if organization doesn't exist when organization_slug provided",
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
            message:
              "given email does not fulfill organization email requirements",
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
            message:
              "given email does not fulfill organization email requirements",
          },
        ]

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
                organizational_identifier: "kissa",
              },
              {
                Authorization: "Bearer admin",
              },
            )

            expect(addUserOrganization).toMatchSnapshot({
              id: expect.any(String),
              confirmed_at: expect.stringMatching(DateRegExp),
            })
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

            expect(addUserOrganization).toMatchSnapshot({
              id: expect.any(String),
              user_organization_join_confirmations: [
                {
                  id: expect.any(String),
                  expires_at: expect.stringMatching(DateRegExp),
                  email_delivery: {
                    id: expect.any(String),
                  },
                },
              ],
            })
          })

          it("creating a user organization join confirmation and an email delivery and user email matches required organizational email", async () => {
            const { addUserOrganization } = await ctx.client.request(
              addUserOrganizationMutation,
              {
                organization_id: "10000000000000000000000000000102",
                language: "fi",
              },
              {
                Authorization: "Bearer third",
              },
            )

            expect(addUserOrganization).toMatchSnapshot({
              id: expect.any(String),
              user_organization_join_confirmations: [
                {
                  id: expect.any(String),
                  expires_at: expect.stringMatching(DateRegExp),
                  email_delivery: {
                    id: expect.any(String),
                  },
                },
              ],
            })
          })

          it("creating a user organization join confirmation and an email delivery and correct required organizational email provided", async () => {
            const { addUserOrganization } = await ctx.client.request(
              addUserOrganizationMutation,
              {
                organization_id: "10000000000000000000000000000102",
                organizational_email: "user@organization.fi",
                redirect: "https://foo.bar",
              },
              {
                Authorization: "Bearer admin",
              },
            )

            expect(addUserOrganization).toMatchSnapshot({
              id: expect.any(String),
              user_organization_join_confirmations: [
                {
                  id: expect.any(String),
                  expires_at: expect.stringMatching(DateRegExp),
                  email_delivery: {
                    id: expect.any(String),
                  },
                },
              ],
            })
          })
        })
      })
    })

    describe("confirmUserOrganizationJoin", () => {
      describe("errors", () => {
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

      describe("succeeds", () => {
        const confirmMembershipSuccessTest = async (authorization: string) => {
          const userOrganizationJoinConfirmation =
            await ctx.prisma.userOrganizationJoinConfirmation.update({
              where: {
                id: CONFIRMATION_ID,
              },
              data: {
                confirmed: { set: false },
                confirmed_at: { set: null },
                expired: { set: false },
                expires_at: "2100-01-01T10:00:00.00+02:00",
                user_organization: {
                  update: {
                    confirmed: { set: false },
                    confirmed_at: { set: null },
                  },
                },
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

          const activationCodeResult = await calculateActivationCode({
            prisma: ctx.prisma,
            userOrganizationJoinConfirmation,
          })

          if (activationCodeResult.isErr()) {
            fail("could not calculate activation code")
          }

          const before = new Date()

          await ctx.client.request(
            confirmUserOrganizationJoinMutation,
            {
              id: CONFIRMATION_ID,
              code: activationCodeResult.value,
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

          expect(updatedConfirmation).toMatchSnapshot(
            {
              confirmed_at: expect.any(Date),
              updated_at: expect.any(Date),
              user_organization: {
                confirmed_at: expect.any(Date),
                updated_at: expect.any(Date),
              },
            },
            authorization,
          )

          expect(updatedConfirmation!.confirmed).toEqual(true)
          expect(
            updatedConfirmation!.confirmed_at!.getTime(),
          ).toBeGreaterThanOrEqual(before.getTime())
          expect(updatedConfirmation?.user_organization?.confirmed).toEqual(
            true,
          )
          expect(
            updatedConfirmation!.updated_at!.getTime(),
          ).toBeGreaterThanOrEqual(
            userOrganizationJoinConfirmation!.updated_at!.getTime(),
          )
          expect(
            updatedConfirmation!.user_organization!.updated_at!.getTime(),
          ).toBeGreaterThanOrEqual(
            userOrganizationJoinConfirmation!.user_organization!.updated_at!.getTime(),
          )
        }

        it("confirming membership if all checks pass", async () => {
          await confirmMembershipSuccessTest("Bearer normal")
        })

        it("confirming membership not associated with self with admin credentials if all checks pass", async () => {
          await confirmMembershipSuccessTest("Bearer admin")
        })
      })
    })
  })

  describe("requestNewUserOrganizationJoinConfirmation", () => {
    describe("errors", () => {
      const errorCases: Array<ErrorCase> = [
        {
          title: "if user is not associated with given user organization id",
          args: {
            id: "96900000000000000000000000000101",
          },
          headers: {
            Authorization: "Bearer third",
          },
          message: "invalid user organization id",
        },
        {
          title: "if organization membership is already confirmed",
          args: {
            id: "96900000000000000000000000000101",
          },
          headers: {
            Authorization: "Bearer normal",
          },
          message:
            "this user organization membership has already been confirmed",
        },
        {
          title: "when new organizational_email given but it is not valid",
          args: {
            id: "96900000000000000000000000000101",
            organizational_email: "kissa@foo.foo",
          },
          headers: {
            Authorization: "Bearer normal",
          },
          message:
            "given email does not fulfill organization email requirements",
          before: async () =>
            ctx.prisma.userOrganizationJoinConfirmation.update({
              where: {
                id: CONFIRMATION_ID,
              },
              data: {
                confirmed: { set: false },
                confirmed_at: { set: null },
                user_organization: {
                  update: {
                    organization: {
                      connect: { id: "10000000000000000000000000000102" },
                    },
                    confirmed: { set: false },
                    confirmed_at: { set: null },
                  },
                },
              },
            }),
        },
      ]

      it.each(errorCases)(
        "$title",
        async ({ args, headers, message, before }) => {
          try {
            if (before) {
              await before()
            }
            await ctx.client.request(
              requestNewUserOrganizationJoinConfirmationMutation,
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

    describe("succeeds", () => {
      const createUnconfirmedUserOrganization = async () =>
        ctx.prisma.userOrganizationJoinConfirmation.update({
          where: {
            id: CONFIRMATION_ID,
          },
          data: {
            confirmed: { set: false },
            confirmed_at: { set: null },
            user_organization: {
              update: {
                confirmed: { set: false },
                confirmed_at: { set: null },
                organization: {
                  update: {
                    required_confirmation: true,
                    required_organization_email: "foo.bar$",
                    join_organization_email_template: {
                      connect: { id: "48383100000000000000000000000101" },
                    },
                  },
                },
              },
            },
          },
        })

      let result: UserOrganizationJoinConfirmation & {
        email_delivery: EmailDelivery & { email_template: EmailTemplate }
        user_organization: UserOrganization & {
          user: User
          organization: Organization
        }
      }

      const createRequest = async (args: Record<string, any> = {}) => {
        result = (
          await ctx.client.request(
            requestNewUserOrganizationJoinConfirmationMutation,
            {
              id: "96900000000000000000000000000101",
              ...args,
            },
            {
              Authorization: "Bearer normal",
            },
          )
        )?.requestNewUserOrganizationJoinConfirmation
      }

      describe("with no extra arguments", () => {
        beforeEach(async () => {
          await createUnconfirmedUserOrganization()
          await createRequest()
        })

        it("returning a confirmation", () => {
          expect(result).toMatchSnapshot({
            id: expect.any(String),
            expires_at: expect.stringMatching(DateRegExp),
            email_delivery: {
              id: expect.any(String),
            },
          })
        })

        it("canceling previous email deliveries", async () => {
          const confirmation =
            await ctx.prisma.userOrganizationJoinConfirmation.findUnique({
              where: {
                id: CONFIRMATION_ID,
              },
              include: {
                email_delivery: true,
              },
            })

          expect(confirmation?.email_delivery?.error).toBe(true)
          expect(confirmation?.email_delivery?.error_message).toEqual(
            expect.stringMatching(
              new RegExp(
                `New activation link requested at ${DateRegExp.source}`,
              ),
            ),
          )
        })

        it("expiring previous confirmation", async () => {
          const confirmation =
            await ctx.prisma.userOrganizationJoinConfirmation.findUnique({
              where: {
                id: CONFIRMATION_ID,
              },
            })

          expect(confirmation?.expired).toBe(true)
        })
      })

      describe("with organizational_email specified", () => {
        beforeEach(async () => {
          await createUnconfirmedUserOrganization()
          await createRequest({
            organizational_email: "new@foo.bar",
          })
        })

        it("creating email delivery to given email", () => {
          expect(result.email_delivery?.email).toEqual("new@foo.bar")
        })

        it("creating confirmation with given email", () => {
          expect(result.email).toEqual("new@foo.bar")
        })

        it("updating the organizational mail in user organization", () => {
          expect(result.user_organization.organizational_email).toEqual(
            "new@foo.bar",
          )
        })
      })

      describe("with language specified", () => {
        beforeEach(async () => {
          await createUnconfirmedUserOrganization()
          await createRequest({
            language: "en",
          })
        })

        it("creating confirmation with given language", () => {
          expect(result.language).toEqual("en")
        })
      })

      describe("with redirect specified", () => {
        beforeEach(async () => {
          await createUnconfirmedUserOrganization()
          await createRequest({
            redirect: "http://foo.foo.bar",
          })
        })

        it("creating confirmation with given redirect", () => {
          expect(result.redirect).toEqual("http://foo.foo.bar")
        })
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
        expired
        expires_at
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
        expired
        expires_at
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

const requestNewUserOrganizationJoinConfirmationMutation = gql`
  mutation RequestNewUserOrganizationJoinConfirmation(
    $id: ID!
    $organizational_email: String
    $redirect: String
    $language: String
  ) {
    requestNewUserOrganizationJoinConfirmation(
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
      email_delivery {
        id
        email
        error
        error_message
        sent
        email_template {
          id
          name
        }
      }
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
