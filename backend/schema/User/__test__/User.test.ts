import { gql } from "graphql-request"

import {
  FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  ID_REGEX,
  orderedSnapshot,
  setupTMCWithDefaultFakeUsers,
} from "../../../tests"
import { normalUser, seed } from "../../../tests/data"

const addUserMutation = gql`
  mutation AddUser($user: UserCreateArg!) {
    addUser(user: $user) {
      id
      email
      first_name
      last_name
      username
      research_consent
      upstream_id
      administrator
    }
  }
`

const updateReseachConsentMutation = gql`
  mutation UpdateResearchConsent($value: Boolean!) {
    updateResearchConsent(value: $value) {
      id
    }
  }
`

const updateUserNameMutation = gql`
  mutation updateUserName($first_name: String, $last_name: String) {
    updateUserName(first_name: $first_name, last_name: $last_name) {
      id
      first_name
      last_name
    }
  }
`

const updateUserMutation = gql`
  mutation UpdateUser($user: UserUpdateArg!) {
    updateUser(user: $user) {
      id
      first_name
      email
      real_student_number
    }
  }
`

const ctx = getTestContext()

describe("User", () => {
  describe("queries", () => {
    setupTMCWithDefaultFakeUsers({
      "Bearer stale": [401, {}],
      "Bearer unchecked": [500, {}],
    })

    describe("currentUser", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      it("shows current user when logged in", async () => {
        const res = await ctx.client.request(
          `
      query {
        currentUser {
          id
          administrator
          email
          first_name
          last_name
          username
          upstream_id
        }
      }
    `,
          {},
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )

        expect(res).toMatchSnapshot({
          currentUser: {
            id: expect.stringMatching(ID_REGEX),
          },
        })

        jest.clearAllMocks()
      })

      it("shows null when not logged in", async () => {
        const res = await ctx.client.request<any>(`
          query {
            currentUser {
              id
              administrator
              email
              first_name
              last_name
              username
              upstream_id
            }
          }
        `)

        expect(res.currentUser).toBeNull()
      })

      it("shows null for a token TMC rejects", async () => {
        const res = await ctx.client.request<any>(
          `query { currentUser { id } }`,
          {},
          { Authorization: "Bearer stale" },
        )

        expect(res.currentUser).toBeNull()
      })

      it("errors when TMC can't check the token", async () => {
        await expect(
          ctx.client.request(
            `query { currentUser { id } }`,
            {},
            { Authorization: "Bearer unchecked" },
          ),
        ).rejects.toThrow("Could not check the sign-in")
      })
    })

    describe("user_course_summary", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      it("returns courses with completions", async () => {
        const res = await ctx.client.request<any>(
          `
          query {
            currentUser {
              id
              user_course_summary {
                user_id
                course_id
                course {
                  id
                  name
                  exercises {
                    id
                    name
                    course_id
                    part
                    section
                    max_points
                  }
                }
                exercise_completions {
                  id
                  exercise_id
                  timestamp
                  n_points
                  attempted
                  completed
                  exercise_completion_required_actions {
                    id
                    value
                  }
                }
              }
            }
          }`,
          {},
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )

        const sortedRes = orderedSnapshot(res, {
          user_course_summary: "course.name",
          exercises: "name",
          exercise_completions: "id",
        })

        expect(sortedRes).toMatchSnapshot()
      })
    })
  })

  describe("mutations", () => {
    setupTMCWithDefaultFakeUsers()

    beforeEach(async () => {
      await ctx.prisma.user.deleteMany({ where: {} })
    })

    describe("addUser", () => {
      const newUser = {
        email: "new@mail.com",
        first_name: "first",
        last_name: "last",
        username: "username",
        research_consent: false,
        upstream_id: 1,
      }

      it("creates user correctly", async () => {
        const res = await ctx.client.request(
          addUserMutation,
          {
            user: {
              email: "e@mail.com",
              first_name: "first",
              last_name: "last",
              username: "username",
              research_consent: false,
              upstream_id: 1,
            },
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        expect(res).toMatchSnapshot({
          addUser: {
            id: expect.any(String),
          },
        })
      })

      it("won't create user with same id", async () => {
        await ctx.prisma.user.create({
          data: normalUser,
        })

        await expect(
          ctx.client.request(
            addUserMutation,
            { user: newUser },
            FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
          ),
        ).rejects.toThrow(/already exists/)
      })

      it("refuses anonymous callers", async () => {
        await expect(
          ctx.client.request(addUserMutation, { user: newUser }),
        ).rejects.toThrow(/Not authorized/)
      })

      it("refuses normal users", async () => {
        await expect(
          ctx.client.request(
            addUserMutation,
            { user: { ...newUser, upstream_id: 999 } },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          ),
        ).rejects.toThrow(/Not authorized/)
        expect(
          await ctx.prisma.user.findFirst({ where: { upstream_id: 999 } }),
        ).toBeNull()
      })
    })

    describe("updateUser", () => {
      beforeEach(async () => {
        await ctx.prisma.user.create({
          data: { ...normalUser, real_student_number: "123" },
        })
      })

      it("lets a normal user update their own name", async () => {
        const res = await ctx.client.request<any>(
          updateUserMutation,
          { user: { first_name: "updated" } },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )

        expect(res.updateUser.first_name).toBe("updated")
      })

      it("refuses a normal user changing their email", async () => {
        await expect(
          ctx.client.request(
            updateUserMutation,
            { user: { email: "other@mail.com" } },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          ),
        ).rejects.toThrow(/only admins/)
      })

      it("refuses a normal user changing their real_student_number", async () => {
        await expect(
          ctx.client.request(
            updateUserMutation,
            { user: { real_student_number: "456" } },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          ),
        ).rejects.toThrow(/only admins/)

        const user = await ctx.prisma.user.findFirst({
          where: { upstream_id: 1 },
        })
        expect(user?.real_student_number).toBe("123")
      })

      it("lets an admin change another user's email and real_student_number", async () => {
        const target = await ctx.prisma.user.findFirstOrThrow({
          where: { upstream_id: 1 },
        })

        const res = await ctx.client.request<any>(
          updateUserMutation,
          {
            user: {
              id: target.id,
              email: "other@mail.com",
              real_student_number: "456",
            },
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        expect(res.updateUser).toMatchObject({
          email: "other@mail.com",
          real_student_number: "456",
        })
      })
    })

    describe("updateResearchConsent", () => {
      beforeEach(async () => {
        await ctx.prisma.user.create({
          data: normalUser,
        })
      })

      afterEach(async () => {
        await ctx.prisma.user.delete({ where: { upstream_id: 1 } })
        ctx.user = undefined
      })

      it("updates correctly", async () => {
        const res = await ctx.client.request<any>(
          updateReseachConsentMutation,
          {
            value: true,
          },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )

        expect(res.updateResearchConsent).toMatchSnapshot({
          id: expect.stringMatching(ID_REGEX),
        })
        const updatedConsent = await ctx.prisma.user.findFirst({
          where: { upstream_id: 1 },
          select: { research_consent: true },
        })

        expect(updatedConsent).toMatchObject({ research_consent: true })
      })

      it("won't update research consent without auth", async () => {
        try {
          await ctx.client.request(updateReseachConsentMutation, {
            value: true,
          })
          fail()
        } catch {}
      })
    })

    describe("updateUserName", () => {
      beforeEach(async () => {
        await ctx.prisma.user.create({
          data: normalUser,
        })
      })

      it("updates correctly", async () => {
        const res = await ctx.client.request<any>(
          updateUserNameMutation,
          {
            first_name: "updated first",
            last_name: "updated last",
          },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )

        expect(res.updateUserName).toMatchObject({
          first_name: "updated first",
          last_name: "updated last",
        })
      })

      it("errors without auth", async () => {
        try {
          await ctx.client.request(updateUserNameMutation, {})
          fail()
        } catch {}
      })
    })
  })
})
