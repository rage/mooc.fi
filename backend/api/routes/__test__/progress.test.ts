import {
  createRequestHelpers,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  RequestGet,
  setupTMCWithDefaultFakeUsers,
} from "../../../tests"
import { seed } from "../../../tests/data"

const ctx = getTestContext()

describe("API", () => {
  describe("/api/user-course-progress", () => {
    setupTMCWithDefaultFakeUsers()

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
        headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
      })

      expect(ucpResponse.status).toBe(200)
      expect(ucpResponse.data).not.toBeNull()

      expect(ucpResponse.data.data.progress).toEqual([
        { group: "week1", max_points: 3, n_points: 0 },
      ])
    })

    it("returns only the oldest instance", async () => {
      const ucpResponse = await getUserCourseProgress("course1")({
        headers: FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
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

  describe("/api/progressv2", () => {
    setupTMCWithDefaultFakeUsers()

    let getProgressv2: (idOrSlug: string, deleted?: boolean) => RequestGet

    beforeEach(async () => {
      await seed(ctx.prisma)
      const { get } = createRequestHelpers(ctx.port)
      getProgressv2 = (idOrSlug: string, deleted = false) =>
        get(`/api/progressv2/${idOrSlug}${deleted ? "?deleted=true" : ""}`, {})
    })

    it("errors on no auth", async () => {
      return getProgressv2("course1")({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on no course found", async () => {
      return getProgressv2("foo")({
        headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
          expect(response.data.message).toContain("course not found")
        })
    })

    test.each([
      {
        paramType: "id",
        param: "00000000000000000000000000000001",
        deleted: false,
      },
      { paramType: "slug", param: "course2", deleted: false },
      {
        paramType: "id",
        param: "00000000000000000000000000000001",
        deleted: true,
      },
      { paramType: "slug", param: "course2", deleted: true },
    ])(
      "returns correct data on course $paramType, include deleted $deleted",
      async ({ param, deleted }) => {
        const res = await getProgressv2(
          param,
          deleted,
        )({
          headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        })

        expect(res.data).toMatchSnapshot()
      },
    )

    // TODO/FIXME: maybe should also test if it returns handler completion,
    // but similar functions are already tested
  })
})
