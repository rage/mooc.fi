import { gql } from "graphql-request"
import { getTestContext, fakeTMCCurrent } from "../../../tests/__helpers"
import { adminUserDetails, normalUserDetails } from "../../../tests/data"
import { seed } from "../../../tests/data/seed"

const recheckMutation = gql`
  mutation RecheckCompletions($course_id: ID, $slug: String) {
    recheckCompletions(course_id: $course_id, slug: $slug)
  }
`

const ctx = getTestContext()
const tmc = fakeTMCCurrent({
  "Bearer normal": [200, normalUserDetails],
  "Bearer admin": [200, adminUserDetails],
})

describe("Completion", () => {
  beforeEach(async () => {
    await seed(ctx.prisma)
  })
  describe("mutations", () => {
    beforeEach(async () => {
      tmc.setup()
    })

    afterAll(() => tmc.teardown())

    describe("recheckCompletions", () => {
      describe("normal user", () => {
        it("errors", async () => {
          return ctx.client
            .request(
              recheckMutation,
              {
                slug: "course1",
              },
              {
                Authorization: "Bearer normal",
              },
            )
            .then(() => fail())
            .catch(({ response }) => {
              expect(response.errors.length).toBe(1)
            })
        })
      })
      describe("admin", () => {
        beforeEach(() => ctx.client.setHeader("Authorization", "Bearer admin"))
        it("errors on no course_id nor slug", async () => {
          return ctx.client
            .request(recheckMutation, {})
            .then(() => fail())
            .catch(({ response }) => {
              expect(response.errors.length).toBe(1)
              expect(response.errors[0].message).toContain("must provide")
            })
        })

        it("errors on non-existent course", async () => {
          return ctx.client
            .request(recheckMutation, { slug: "bogus" })
            .then(() => fail())
            .catch(({ response }) => {
              expect(response.errors.length).toBe(1)
              expect(response.errors[0].message).toContain("course not found")
            })
        })

        it("checks completions, creating new where necessary", async () => {
          const progressUpdateSpy = jest.spyOn(
            ctx.prisma.userCourseProgress,
            "update",
          )
          const completionCreateSpy = jest.spyOn(
            ctx.prisma.completion,
            "create",
          )

          const res = await ctx.client.request(recheckMutation, {
            course_id: "00000000000000000000000000000002",
          })

          expect(res.recheckCompletions).toEqual("1 users rechecked")
          expect(progressUpdateSpy).toHaveBeenCalledTimes(1)
          expect(completionCreateSpy).toHaveBeenCalledTimes(1)

          const userCompletions = await ctx.prisma.completion.findMany({
            where: {
              user_id: "20000000000000000000000000000104",
            },
          })

          expect(userCompletions.length).toBe(1)
          expect(userCompletions[0].course_id).toEqual(
            "00000000-0000-0000-0000-000000000002",
          )
          progressUpdateSpy.mockClear()
        })
      })
    })
  })
})
