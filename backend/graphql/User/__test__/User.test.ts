import { gql } from "graphql-request"
import { orderBy } from "lodash"

import {
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  ID_REGEX,
  setupTMCWithDefaultFakeUsers,
} from "../../../tests"
import { normalUser, seed } from "../../../tests/data"

const addUserMutation = gql`
  mutation AddUser($user: UserArg!) {
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

const ctx = getTestContext()

// @ts-ignore: not used
const sortByExercise = (data: any) => {
  if (!data?.exercise_completions) {
    return data
  }

  return {
    ...data,
    exercise_completions: orderBy(
      data.exercise_completions.map((ec: any) => ec.exercise),
      ["id"],
      ["asc"],
    ),
  }
}

describe("User", () => {
  describe("queries", () => {
    setupTMCWithDefaultFakeUsers()

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
          }
        `,
          {},
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )

        const sortedRes = {
          currentUser: {
            ...res?.currentUser,
            user_course_summary: orderBy(
              [
                ...res?.currentUser?.user_course_summary?.map((cs: any) => ({
                  ...cs,
                  course: {
                    ...cs.course,
                    exercises: orderBy(cs.course.exercises, ["name"]),
                  },
                  exercise_completions: orderBy(cs?.exercise_completions, [
                    "id",
                  ]),
                })),
              ],
              "course.name",
              "asc",
            ),
          },
        }

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
      it("creates user correctly", async () => {
        const res = await ctx.client.request(addUserMutation, {
          user: {
            email: "e@mail.com",
            first_name: "first",
            last_name: "last",
            username: "username",
            research_consent: false,
            upstream_id: 1,
          },
        })

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

        await expect(async () => {
          await ctx.client.request(addUserMutation, {
            user: {
              email: "e@mail.com",
              first_name: "first",
              last_name: "last",
              username: "username",
              research_consent: false,
              upstream_id: 1,
            },
          })
        }).rejects.toThrow()
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
