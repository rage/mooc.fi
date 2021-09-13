import {
  createRequestHelpers,
  fakeTMCCurrent,
  getTestContext,
  RequestGet,
} from "../../tests/__helpers"
import { normalUserDetails } from "../../tests/data"
import { seed } from "../../tests/data/seed"

const ctx = getTestContext()

describe("API", () => {
  describe("/user-course-progress", () => {
    const tmc = fakeTMCCurrent({
      "Bearer normal": [200, normalUserDetails],
      "Bearer third": [200, { ...normalUserDetails, id: 3 }],
    })

    beforeAll(() => tmc.setup())
    afterAll(() => tmc.teardown())

    let getUserCourseProgress: (slug: string) => RequestGet
    beforeEach(async () => {
      await seed(ctx.prisma)
      const { get } = createRequestHelpers(ctx.port)
      getUserCourseProgress = (slug: string) =>
        get(`/api/user-course-progress/${slug}`, {})
    })

    it("errors on no auth", async () => {
      return getUserCourseProgress("course1")({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("returns data", async () => {
      const ucpResponse = await getUserCourseProgress("course1")({
        headers: {
          Authorization: "Bearer normal",
        },
      })

      expect(ucpResponse.status).toBe(200)
      expect(ucpResponse.data).not.toBeNull()

      expect(ucpResponse.data.data.progress).toEqual([
        { group: "week1", max_points: 3, n_points: 0 },
      ])
    })

    it("returns only the oldest instance", async () => {
      const ucpResponse = await getUserCourseProgress("course1")({
        headers: {
          Authorization: "Bearer third",
        },
      })

      expect(ucpResponse.status).toBe(200)
      expect(ucpResponse.data).not.toBeNull()

      expect(ucpResponse.data.data.progress).toEqual([
        { group: "week1", max_points: 3, n_points: 3 },
      ])
      expect(ucpResponse.data.data.created_at).toEqual(
        "1900-01-01T08:00:00.000Z",
      )
    })
  })
})
