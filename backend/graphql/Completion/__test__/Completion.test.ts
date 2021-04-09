import { gql } from "graphql-request"
import { getTestContext, fakeTMCCurrent } from "../../../tests/__helpers"
import { adminUserDetails, normalUserDetails } from "../../../tests/data"
import { seed } from "../../../tests/data/seed"
import { Prisma } from ".prisma/client"

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

        it.only("checks completions", async () => {
          const progresses: Prisma.UserCourseProgressCreateInput[] = [
            {
              id: "12300000000000000000000000000001",
              course: { connect: { id: "00000000000000000000000000000002" } },
              user: { connect: { id: "20000000000000000000000000000102" } },
              n_points: 0,
              progress: [{ group: "week1", max_points: 3, n_points: 0 }],
              created_at: "1900-01-01T10:00:00.00+02:00",
              updated_at: "1900-01-01T10:00:00.00+02:00", // should be skipped (0 points)
            },
            {
              id: "12300000000000000000000000000002",
              course: { connect: { id: "00000000000000000000000000000002" } },
              n_points: 1,
              progress: [{ group: "week1", max_points: 3, n_points: 1 }],
              created_at: "1900-01-01T10:00:00.00+02:00",
              updated_at: "1900-01-01T10:00:00.00+02:00", // should be skipped (user null)
            },
            {
              id: "12300000000000000000000000000003",
              course: { connect: { id: "00000000000000000000000000000002" } },
              user: { connect: { id: "20000000000000000000000000000103" } },
              n_points: 2,
              progress: [{ group: "week1", max_points: 3, n_points: 2 }],
              created_at: "1900-01-01T10:00:00.00+02:00",
              updated_at: "1900-01-01T10:00:00.00+02:00", // has an existing completion
            },
            {
              id: "12300000000000000000000000000004",
              course: { connect: { id: "00000000000000000000000000000002" } },
              user: { connect: { id: "20000000000000000000000000000104" } },
              n_points: 3,
              progress: [{ group: "week1", max_points: 3, n_points: 3 }],
              created_at: "1900-01-01T10:00:00.00+02:00",
              updated_at: "1900-01-01T10:00:00.00+02:00", // should lead to new completion
            },
            {
              id: "12300000000000000000000000000005",
              course: { connect: { id: "00000000000000000000000000000002" } },
              user: { connect: { id: "20000000000000000000000000000104" } },
              n_points: 2,
              progress: [{ group: "week1", max_points: 3, n_points: 2 }],
              created_at: "1901-01-01T10:00:00.00+02:00",
              updated_at: "1901-01-01T10:00:00.00+02:00", // should be skipped as newer duplicate
            },
          ]
          const userCourseServiceProgresses: Prisma.UserCourseServiceProgressCreateInput[] = [
            {
              course: { connect: { id: "00000000000000000000000000000002" } },
              user: { connect: { id: "20000000000000000000000000000104" } },
              service: {
                connect: { id: "40000000-0000-0000-0000-000000000102" },
              },
              progress: [{ group: "week1", max_points: 3, n_points: 3 }],
            },
          ]

          const completions: Prisma.CompletionCreateInput[] = [
            {
              id: "12400000000000000000000000000001",
              user: { connect: { id: "20000000000000000000000000000103" } },
              course: { connect: { id: "00000000000000000000000000000002" } },
              email: "what@ever.com",
              created_at: "1900-01-01T10:00:00.00+02:00",
              updated_at: "1900-01-01T10:00:00.00+02:00",
            },
          ]

          const exerciseCompletions: Prisma.ExerciseCompletionCreateInput[] = [
            {
              user: { connect: { id: "20000000000000000000000000000104" } },
              exercise: {
                connect: { id: "50000000-0000-0000-0000-000000000003" },
              },
              completed: true,
              timestamp: new Date("2021-01-01 10:00:00.00"),
            },
          ]

          for (const data of progresses) {
            await ctx.prisma.userCourseProgress.create({ data })
          }
          for (const data of userCourseServiceProgresses) {
            await ctx.prisma.userCourseServiceProgress.create({ data })
          }
          for (const data of completions) {
            await ctx.prisma.completion.create({ data })
          }
          for (const data of exerciseCompletions) {
            await ctx.prisma.exerciseCompletion.create({ data })
          }

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
