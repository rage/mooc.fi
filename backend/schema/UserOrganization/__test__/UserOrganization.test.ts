import { gql } from "graphql-request"

import {
  EmailDelivery,
  EmailTemplate,
  Organization,
  User,
  UserOrganization,
  UserOrganizationJoinConfirmation,
} from "@prisma/client"

import { DEFAULT_JOIN_ORGANIZATION_EMAIL_TEMPLATE_ID } from "../../../config/defaultData"
import {
  FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
  fakeTMCCurrent,
  getTestContext,
} from "../../../tests"
import {
  adminUserDetails,
  normalUserDetails,
  seed,
  thirdUserDetails,
} from "../../../tests/data"
import { calculateActivationCode, PromiseReturnType } from "../../../util"

const ctx = getTestContext()
const tmc = fakeTMCCurrent({
  [FAKE_NORMAL_USER_AUTHORIZATION_HEADERS["Authorization"]]: [
    200,
    normalUserDetails,
  ],
  [FAKE_ADMIN_USER_AUTHORIZATION_HEADERS["Authorization"]]: [
    200,
    adminUserDetails,
  ],
  [FAKE_THIRD_USER_AUTHORIZATION_HEADERS["Authorization"]]: [
    200,
    thirdUserDetails,
  ],
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
  options?: Record<string, any>
  before?: ((...args: any[]) => any) | AsyncFunction
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
            headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
            message: "invalid credentials to do that",
          },
          {
            title: "if user doesn't exist",
            args: {
              user_id: "20000000000000000000000000000999",
              organization_id: "10000000000000000000000000000102",
            },
            headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
            message: "no such user",
          },
          {
            title:
              "if organization doesn't exist when organization_id provided",
            args: {
              user_id: "20000000000000000000000000000103",
              organization_id: "10000000000000000000000000000999",
            },
            headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
            message: "no such organization",
          },
          {
            title:
              "if organization doesn't exist when organization_slug provided",
            args: {
              user_id: "20000000000000000000000000000103",
              organization_slug: "foofoo",
            },
            headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
            message: "no such organization",
          },
          {
            title: "if neither organization_id nor organization_slug provided",
            headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
            message: "no organization_id nor organization_slug provided",
          },
          {
            title: "if user is already a member of the organization",
            args: {
              organization_id: "10000000000000000000000000000103",
            },
            headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
            message: "this user/organization relation already exists",
          },
          {
            title:
              "if join requires organizational email and user email does not match",
            args: {
              organization_id: "10000000000000000000000000000102",
            },
            headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
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
            headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
            message:
              "given email does not fulfill organization email requirements",
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
                addUserOrganizationMutation,
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
        describe("with no confirmation required", () => {
          it("adding user to organization", async () => {
            const { addUserOrganization } = await ctx.client.request<any>(
              addUserOrganizationMutation,
              {
                organization_id: "10000000000000000000000000000103",
                organizational_identifier: "kissa",
              },
              FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
            )

            expect(addUserOrganization).toMatchSnapshot({
              id: expect.any(String),
              confirmed_at: expect.stringMatching(DateRegExp),
            })
          })
        })

        describe("with confirmation required", () => {
          it("creating a user organization join confirmation and an email delivery", async () => {
            const { addUserOrganization } = await ctx.client.request<any>(
              addUserOrganizationMutation,
              {
                organization_id: "10000000000000000000000000000104",
              },
              FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
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
            const { addUserOrganization } = await ctx.client.request<any>(
              addUserOrganizationMutation,
              {
                organization_id: "10000000000000000000000000000102",
                language: "fi",
              },
              FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
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
            const { addUserOrganization } = await ctx.client.request<any>(
              addUserOrganizationMutation,
              {
                organization_id: "10000000000000000000000000000102",
                organizational_email: "user@organization.fi",
                redirect: "https://foo.bar",
              },
              FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
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

          it("using the default email template if one isn't specified", async () => {
            await ctx.prisma.organization.update({
              where: {
                id: "10000000000000000000000000000102",
              },
              data: {
                join_organization_email_template: { disconnect: true },
              },
            })

            const { addUserOrganization } = await ctx.client.request<any>(
              addUserOrganizationMutation,
              {
                organization_id: "10000000000000000000000000000102",
                organizational_email: "user@organization.fi",
                redirect: "https://foo.bar",
              },
              FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
            )

            expect(addUserOrganization).toMatchSnapshot({
              id: expect.any(String),
              user_organization_join_confirmations: [
                {
                  id: expect.any(String),
                  expires_at: expect.stringMatching(DateRegExp),
                  email_delivery: {
                    id: expect.any(String),
                    email_template: {
                      id: DEFAULT_JOIN_ORGANIZATION_EMAIL_TEMPLATE_ID,
                    },
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
            headers: FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
            message: "invalid confirmation id",
          },
          {
            title: "if membership has already been confirmed",
            args: {
              id: CONFIRMATION_ID,
              code: "foo",
            },
            headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
            message:
              "this user organization membership has already been confirmed",
          },
          {
            title: "if confirmation has expired",
            args: {
              id: CONFIRMATION_ID,
              code: "foo",
            },
            headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
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
            headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
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
            headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
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
        const confirmMembershipSuccessTest = async (
          headers: Record<string, string>,
        ) => {
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
            headers,
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
            headers["Authorization"],
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
          await confirmMembershipSuccessTest(
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )
        })

        it("confirming membership not associated with self with admin credentials if all checks pass", async () => {
          await confirmMembershipSuccessTest(
            FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
          )
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
          headers: FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
          message: "invalid user organization id",
        },
        {
          title: "if organization membership is already confirmed",
          args: {
            id: "96900000000000000000000000000101",
          },
          headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          message:
            "this user organization membership has already been confirmed",
        },
        {
          title: "if new organizational_email given but it is not valid",
          args: {
            id: "96900000000000000000000000000101",
            organizational_email: "kissa@foo.foo",
          },
          headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
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
      let result: UserOrganizationJoinConfirmation & {
        email_delivery: EmailDelivery & { email_template: EmailTemplate }
        user_organization: UserOrganization & {
          user: User
          organization: Organization
        }
      }

      const createRequest = async (args: Record<string, any> = {}) => {
        result = (
          await ctx.client.request<any>(
            requestNewUserOrganizationJoinConfirmationMutation,
            {
              id: "96900000000000000000000000000101",
              ...args,
            },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
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

      describe("with no organizational email template specified", () => {
        beforeEach(async () => {
          await createUnconfirmedUserOrganization()
          await ctx.prisma.userOrganizationJoinConfirmation.update({
            where: {
              id: CONFIRMATION_ID,
            },
            data: {
              user_organization: {
                update: {
                  organization: {
                    update: {
                      join_organization_email_template: { disconnect: true },
                    },
                  },
                },
              },
            },
          })
          await createRequest()
        })

        it("creating an email delivery with the default template", () => {
          expect(result.email_delivery?.email_template?.id).toEqual(
            DEFAULT_JOIN_ORGANIZATION_EMAIL_TEMPLATE_ID,
          )
        })
      })
    })
  })

  describe("updateUserOrganizationOrganizationalEmail", () => {
    interface CreateUserOrganizationArgs {
      withOrganizationalEmail?: boolean
      confirmed?: boolean
      hasExistingConfirmation?: boolean
    }

    const createUserOrganization = async (
      args?: CreateUserOrganizationArgs,
    ) => {
      const {
        withOrganizationalEmail = true,
        confirmed = false,
        hasExistingConfirmation = true,
      } = args ?? {}

      const organizationalEmail = withOrganizationalEmail
        ? "third_user@organization.fi"
        : undefined
      const originalUserEmail = thirdUserDetails.email
      const joinConfirmationMail = withOrganizationalEmail
        ? "third_user@organization.fi"
        : originalUserEmail

      return ctx.prisma.userOrganization.create({
        data: {
          id: "96900000000000000000000000000199",
          user: { connect: { id: "20000000000000000000000000000104" } },
          organization: {
            connect: { id: "10000000000000000000000000000102" },
          },
          confirmed,
          consented: true,
          organizational_email: organizationalEmail,
          ...(hasExistingConfirmation && {
            user_organization_join_confirmations: {
              create: {
                id: "96900000000000000000000000001199",
                email: joinConfirmationMail,
                expires_at: "2100-01-01T00:00:00.000Z",
                expired: false,
                language: "fi",
                confirmed,
                email_delivery: {
                  create: {
                    id: "96900000000000000000000000002199",
                    email_template: {
                      connect: { id: "48383100000000000000000000000101" },
                    },
                    user: {
                      connect: { id: "20000000000000000000000000000104" },
                    },
                    organization: {
                      connect: { id: "10000000000000000000000000000102" },
                    },
                    email: joinConfirmationMail,
                    sent: false,
                    error: false,
                  },
                },
              },
            },
          }),
        },
        include: {
          organization: true,
          user_organization_join_confirmations: {
            include: {
              email_delivery: {
                include: {
                  email_template: true,
                },
              },
            },
          },
        },
      })
    }

    describe("errors", () => {
      const errorCases: Array<ErrorCase> = [
        {
          title: "if user is not associated with given user organization",
          args: {
            id: "96900000000000000000000000000199",
            organizational_email: "foo@foo.fi",
          },
          headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          message: "invalid credentials to do that",
        },
        {
          title: "if user organization is not found",
          args: {
            id: "06900000000000000000000000000199",
            organizational_email: "foo@foo.fi",
          },
          headers: FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
          message: "no such user/organization relation or no user in relation",
        },
        {
          title: "if new organizational email is not valid",
          args: {
            id: "96900000000000000000000000000199",
            organizational_email: "foo@foo.fi",
          },
          headers: FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
          message:
            "given email does not fulfill organization email requirements",
        },
      ]

      it.each(errorCases)(
        "$title",
        async ({ args, headers, message, before }) => {
          try {
            await createUserOrganization()
            if (before) {
              await before()
            }
            await ctx.client.request(
              updateUserOrganizationOrganizationalMailMutation,
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
      let result: UserOrganization & {
        organization: Organization
        user_organization_join_confirmations: Array<
          UserOrganizationJoinConfirmation & {
            email_delivery: EmailDelivery
          }
        >
      }

      const createRequest = async (args: any, headers?: any) => {
        result = (
          await ctx.client.request<any>(
            updateUserOrganizationOrganizationalMailMutation,
            args,
            headers,
          )
        )?.updateUserOrganizationOrganizationalMail
      }

      describe("with changed email", () => {
        beforeEach(async () => {
          await createUserOrganization()
          await createRequest(
            {
              id: "96900000000000000000000000000199",
              organizational_email: "foo@organization.fi",
              language: "en",
            },
            FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
          )
        })

        it("creating a new user organization join confirmation and email delivery with new mail", async () => {
          expect(result.user_organization_join_confirmations.length).toBe(2)
          expect(result.user_organization_join_confirmations[0].id).not.toEqual(
            "96900000-0000-0000-0000-000000001199",
          )
          expect(result.user_organization_join_confirmations[0].email).toEqual(
            "foo@organization.fi",
          )
          expect(
            result.user_organization_join_confirmations[0].email_delivery,
          ).toBeDefined()
          expect(
            result.user_organization_join_confirmations[0].email_delivery.email,
          ).toEqual("foo@organization.fi")
        })

        it("canceling email deliveries for the old confirmation", async () => {
          expect(
            result.user_organization_join_confirmations[1].email_delivery.error,
          ).toBe(true)
          expect(
            result.user_organization_join_confirmations[1].email_delivery
              .error_message,
          ).toContain("Organizational mail change")
        })

        it("expiring the previous confirmation", async () => {
          expect(result.user_organization_join_confirmations[1].expired).toBe(
            true,
          )
        })

        it("updating user organizational email", async () => {
          expect(result.organizational_email).toEqual("foo@organization.fi")
        })

        it("changing language if provided", async () => {
          expect(
            result.user_organization_join_confirmations[0].language,
          ).toEqual("en")
        })
      })

      describe("with same email", () => {
        let original: PromiseReturnType<typeof createUserOrganization>

        beforeEach(async () => {
          original = await createUserOrganization()
          await createRequest(
            {
              id: "96900000000000000000000000000199",
              organizational_email: "third_user@organization.fi",
            },
            FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
          )
        })

        it("changing nothing", async () => {
          const updated = await ctx.prisma.userOrganization.findUnique({
            where: {
              id: "96900000000000000000000000000199",
            },
            include: {
              organization: true,
              user_organization_join_confirmations: {
                include: {
                  email_delivery: {
                    include: {
                      email_template: true,
                    },
                  },
                },
              },
            },
          })

          expect(updated).toEqual(original)
        })
      })

      describe("with no previous confirmation", () => {
        beforeEach(async () => {
          await createUserOrganization({ hasExistingConfirmation: false })
          await createRequest(
            {
              id: "96900000000000000000000000000199",
              organizational_email: "foo@organization.fi",
            },
            FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
          )
        })

        it("creating a new user organization join confirmation and email delivery with new mail", async () => {
          expect(result.user_organization_join_confirmations.length).toBe(1)
          expect(result.user_organization_join_confirmations[0].email).toEqual(
            "foo@organization.fi",
          )
          expect(
            result.user_organization_join_confirmations[0].email_delivery,
          ).toBeDefined()
          expect(
            result.user_organization_join_confirmations[0].email_delivery.email,
          ).toEqual("foo@organization.fi")
        })
      })

      describe("with no previous organizational email", () => {
        beforeEach(async () => {
          await createUserOrganization({ withOrganizationalEmail: false })
          await createRequest(
            {
              id: "96900000000000000000000000000199",
              organizational_email: "foo@organization.fi",
            },
            FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
          )
        })

        it("creating a new user organization join confirmation and email delivery with new mail", async () => {
          expect(result.user_organization_join_confirmations.length).toBe(2)
          expect(result.user_organization_join_confirmations[0].id).not.toEqual(
            "96900000-0000-0000-0000-000000001199",
          )
          expect(result.user_organization_join_confirmations[0].email).toEqual(
            "foo@organization.fi",
          )
          expect(
            result.user_organization_join_confirmations[0].email_delivery,
          ).toBeDefined()
          expect(
            result.user_organization_join_confirmations[0].email_delivery.email,
          ).toEqual("foo@organization.fi")
        })

        it("updates user organizational email", async () => {
          expect(result.organizational_email).toEqual("foo@organization.fi")
        })
      })

      describe("with organization that does not require confirmation", () => {
        beforeEach(async () => {
          await ctx.prisma.organization.update({
            where: {
              id: "10000000000000000000000000000102",
            },
            data: {
              required_confirmation: { set: false },
              required_organization_email: null,
            },
          })

          await createUserOrganization({ hasExistingConfirmation: false })
          await createRequest(
            {
              id: "96900000000000000000000000000199",
              organizational_email: "foo@organization.fi",
            },
            FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
          )
        })

        it("updating organization email", async () => {
          expect(result.organizational_email).toEqual("foo@organization.fi")
          expect(result.user_organization_join_confirmations.length).toBe(0)
        })
      })

      describe("with organization with no specified email template", () => {
        beforeEach(async () => {
          await createUserOrganization()
          await ctx.prisma.organization.update({
            where: {
              id: "10000000000000000000000000000102",
            },
            data: {
              join_organization_email_template: { disconnect: true },
            },
          })
          await createRequest(
            {
              id: "96900000000000000000000000000199",
              organizational_email: "foo@organization.fi",
              language: "en",
            },
            FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
          )
        })

        it("creating a new email delivery with the default template", () => {
          expect(result.user_organization_join_confirmations.length).toBe(2)
          expect(
            result.user_organization_join_confirmations[0]?.email_delivery
              ?.email_template_id,
          ).toEqual(DEFAULT_JOIN_ORGANIZATION_EMAIL_TEMPLATE_ID)
        })
      })
    })
  })
})

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
          error
          error_message
          sent
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
          error
          error_message
          sent
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

const updateUserOrganizationOrganizationalMailMutation = gql`
  mutation UpdateUserOrganizationOrganizationalMail(
    $id: ID!
    $organizational_email: String!
    $redirect: String
    $language: String
  ) {
    updateUserOrganizationOrganizationalMail(
      id: $id
      organizational_email: $organizational_email
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
          error
          error_message
          sent
          email_template_id
          email_template {
            id
            name
          }
        }
      }
    }
  }
`
