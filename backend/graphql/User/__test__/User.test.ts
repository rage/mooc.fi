import { gql } from "graphql-request"
import { getTestContext, fakeTMCCurrent } from "../../../tests/__helpers"
import {
  adminUserDetails,
  normalUser,
  normalUserDetails,
} from "../../../tests/data"
import { seed } from "../../../tests/data/seed"
import { orderBy } from "lodash"

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
const tmc = fakeTMCCurrent({
  "Bearer normal": [200, normalUserDetails],
  "Bearer admin": [200, adminUserDetails],
})

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
    beforeEach(() => {
      tmc.setup()
    })

    afterAll(() => tmc.teardown())

    describe("currentUser", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
      })
      /*beforeEach(async () => {
        await ctx.prisma.user.create({
          data: normalUser,
        })
      })*/

      it("shows current user when logged in", async () => {
        ctx!.client.setHeader("Authorization", "Bearer normal")

        const res = await ctx.client.request(`
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

        expect(res).toMatchInlineSnapshot(
          {
            currentUser: {
              id: expect.any(String),
              administrator: false,
              email: "e@mail.com",
              first_name: "first",
              last_name: "last",
              username: "user",
              upstream_id: 1,
            },
          },
          `
              Object {
                "currentUser": Object {
                  "administrator": false,
                  "email": "e@mail.com",
                  "first_name": "first",
                  "id": Any<String>,
                  "last_name": "last",
                  "upstream_id": 1,
                  "username": "user",
                },
              }
          `,
        )

        jest.clearAllMocks()
      })

      it("shows null when not logged in", async () => {
        ctx!.client.setHeader("Authorization", "")

        const res = await ctx.client.request(`
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

        expect(res).toMatchInlineSnapshot(
          {
            currentUser: null,
          },
          `
        Object {
          "currentUser": null,
        }
      `,
        )
      })
    })

    describe("user_course_summary", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      it("returns courses with completions", async () => {
        ctx!.client.setHeader("Authorization", "Bearer normal")

        const res = await ctx.client.request(`
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
        `)

        const sortedRes = {
          currentUser: {
            ...res?.currentUser,
            user_course_summary: [
              ...res?.currentUser?.user_course_summary?.map((cs: any) => ({
                ...cs,
                course: {
                  ...cs.course,
                  exercises: orderBy(cs.course.exercises, ["name"]),
                },
                exercise_completions: orderBy(cs?.exercise_completions, ["id"]),
              })),
            ],
          },
        }

        expect(sortedRes).toMatchSnapshot()
      })
    })
  })

  describe("mutations", () => {
    beforeAll(() => {
      tmc.setup()
    })

    afterAll(() => tmc.teardown())

    beforeEach(async () => {
      await ctx.prisma.user.deleteMany({ where: {} })
    })

    describe("addUser", () => {
      beforeAll(() => ctx!.client.setHeader("Authorization", ""))

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
        await ctx!.prisma.user.create({
          data: normalUser,
        })
      })

      afterEach(async () => {
        await ctx!.prisma.user.delete({ where: { upstream_id: 1 } })
        ctx.user = undefined
      })

      it("updates correctly", async () => {
        ctx!.client.setHeader("Authorization", "Bearer normal")

        const res = await ctx!.client.request(updateReseachConsentMutation, {
          value: true,
        })

        expect(res.updateResearchConsent).toMatchInlineSnapshot(
          { id: expect.any(String) },
          `
        Object {
          "id": Any<String>,
        }
      `,
        )
        const updatedConsent = await ctx!.prisma.user.findFirst({
          where: { upstream_id: 1 },
          select: { research_consent: true },
        })

        expect(updatedConsent).toMatchObject({ research_consent: true })
      })

      it("won't update research consent without auth", async () => {
        ctx!.client.setHeader("Authorization", "")

        try {
          await ctx!.client.request(updateReseachConsentMutation, {
            value: true,
          })
          fail()
        } catch {}
      })
    })

    describe("updateUserName", () => {
      beforeEach(async () => {
        await ctx!.prisma.user.create({
          data: normalUser,
        })
      })

      it("updates correctly", async () => {
        ctx!.client.setHeader("Authorization", "Bearer normal")

        const res = await ctx!.client.request(updateUserNameMutation, {
          first_name: "updated first",
          last_name: "updated last",
        })

        expect(res.updateUserName).toMatchObject({
          first_name: "updated first",
          last_name: "updated last",
        })
      })

      it("errors without auth", async () => {
        ctx!.client.setHeader("Authorization", "")
        try {
          await ctx!.client.request(updateUserNameMutation, {})
          fail()
        } catch {}
      })
    })
  })
})
