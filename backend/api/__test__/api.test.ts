import axios, { Method } from "axios"
import { omit, orderBy } from "lodash"

import { updateUserFromTMC } from "../../api/user"
import { ApiContext } from "../../auth"
import { fakeTMCCurrent, getTestContext } from "../../tests/__helpers"
import {
  adminUserDetails,
  normalUserDetails,
  thirdUserDetails,
} from "../../tests/data"
import { seed } from "../../tests/data/seed"

jest.mock("../../util/validateAuth", () => ({
  __esModule: true,
  requireAuth: async (auth: string, _ctx: ApiContext) => {
    let ret: any = {
      id: "20000000000000000000000000000102",
    }
    if (auth === "") {
      ret = {
        error: "Missing token",
      }
    }
    if (auth === "Bearer old") {
      ret = {
        error: "Token is no longer valid",
      }
    }
    if (auth === "Bearer invalid") {
      ret = {
        error: "Some JWT error",
      }
    }

    return new Promise((resolve) => resolve(ret))
  },
}))
const ctx = getTestContext()

describe("API", () => {
  interface RequestParams {
    data?: any
    headers?: any
    params?: Record<string, any>
  }
  const request = (method: Method) => (
    route: string = "",
    defaultHeaders: any,
  ) => async ({
    data = null,
    headers = defaultHeaders,
    params = {},
  }: RequestParams) =>
    await axios({
      method,
      url: `http://localhost:${ctx.port}${route}`,
      data,
      headers,
      params,
    })

  const get = (route: string = "", defaultHeaders: any) =>
    request("GET")(route, defaultHeaders)
  const post = (route: string = "", defaultHeaders: any) =>
    request("POST")(route, defaultHeaders)

  describe("/register-completions", () => {
    const defaultHeaders = {
      Authorization: "Basic kissa",
    }
    const postCompletions = post("/api/register-completions", defaultHeaders)

    beforeEach(async () => {
      await seed(ctx.prisma)
    })

    it("errors on wrong authorization", async () => {
      return postCompletions({
        data: { foo: 1 },
        headers: { Authorization: "foo" },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on non-existent secret", async () => {
      return postCompletions({
        data: { foo: 1 },
        headers: { Authorization: "Basic koira" },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on no completions", async () => {
      return postCompletions({ data: { foo: 1 } })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(400)
        })
    })

    it("errors on malformed completion", async () => {
      return postCompletions({
        data: {
          completions: [
            {
              foo: 1,
            },
          ],
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("creates registered completions", async () => {
      const res = await postCompletions({
        data: {
          completions: [
            {
              completion_id: "30000000-0000-0000-0000-000000000102",
              student_number: "12345",
            },
            {
              completion_id: "30000000-0000-0000-0000-000000000103",
              student_number: "12345",
            },
          ],
        },
      })

      expect(res.status).toBe(200)

      const addedCompletions = await ctx.prisma.completionRegistered.findMany({
        where: {
          user_id: "20000000000000000000000000000102",
        },
      })

      expect(orderBy(addedCompletions, "completion_id")).toMatchSnapshot([
        {
          id: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        },
        {
          id: expect.any(String),
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        },
      ])
    })
  })

  describe("/user-course-settings", () => {
    const tmc = fakeTMCCurrent({
      "Bearer normal": [200, normalUserDetails],
      "Bearer admin": [200, adminUserDetails],
      "Bearer third": [200, thirdUserDetails],
    })

    describe("GET", () => {
      const getSettings = (slug: string) =>
        get(`/api/user-course-settings/${slug}`, {})

      beforeAll(() => tmc.setup())
      afterAll(() => tmc.teardown())

      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      it("errors without slug", async () => {
        return getSettings("")({})
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(400)
          })
      })

      it("errors without auth", async () => {
        return getSettings("course1")({})
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(401)
          })
      })

      it("returns null with user with no settings", async () => {
        return getSettings("course1")({
          headers: { Authorization: "Bearer third" },
        }).then((res) => {
          expect(res.data).toBeNull()
        })
      })

      it("returns null with course with no settings", async () => {
        return getSettings("handler")({
          headers: { Authorization: "Bearer normal" },
        }).then((res) => {
          expect(res.data).toBeNull()
        })
      })

      it("warns on key clashes", async () => {
        return getSettings("course2")({
          headers: { Authorization: "Bearer admin" },
        }).then(async (_) => {
          // @ts-ignore: mock
          expect(ctx.logger.warn.mock.calls.length).toBeGreaterThan(0)
          // @ts-ignore: mock
          expect(ctx.logger.warn.mock.calls[0][0]).toContain("country")
          // @ts-ignore: mock
          expect(ctx.logger.warn.mock.calls[0][0]).toContain("research")
        })
      })

      it("returns settings correctly", async () => {
        return getSettings("course1")({
          headers: { Authorization: "Bearer admin" },
        }).then(async (res) => {
          const settings = await ctx.prisma.userCourseSetting.findFirst({
            where: {
              id: "40000000-0000-0000-0000-000000000102",
            },
          })
          const expected = {
            ...omit(settings, "other"),
            ...((settings!.other as object) ?? {}),
          }

          expect(res.data).toEqual(JSON.parse(JSON.stringify(expected)))
        })
      })
    })

    describe("POST", () => {
      const postSettings = (slug: string) =>
        post(`/api/user-course-settings/${slug}`, {})

      beforeAll(() => tmc.setup())
      afterAll(() => tmc.teardown())

      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      it("errors without slug", async () => {
        return postSettings("")({
          data: { foo: 1 },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(400)
          })
      })

      it("errors without auth", async () => {
        return postSettings("course1")({
          data: { foo: 1 },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(401)
          })
      })

      it("errors on non-existing course", async () => {
        return postSettings("foooo")({
          data: { foo: 1 },
          headers: { Authorization: "Bearer admin" },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.data.message).toContain("no course")
            expect(response.status).toBe(400)
          })
      })

      it("errors without given values", async () => {
        return postSettings("course1")({
          data: {},
          headers: { Authorization: "Bearer admin" },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.data.message).toContain("must provide")
            expect(response.status).toBe(400)
          })
      })

      it("creates new setting when no existing found", async () => {
        const res = await postSettings("handler")({
          data: {
            id: "bogus",
            language: "fi",
            country: "en",
            marketing: true,
            isCat: true,
            sound: "meow",
          },
          headers: { Authorization: "Bearer normal" },
        })

        expect(res.data.message).toContain("settings created")
        expect(res.status).toBe(200)

        const createdSetting = await ctx.prisma.userCourseSetting.findFirst({
          where: {
            user_id: "20000000-0000-0000-0000-000000000102",
            course_id: "00000000-0000-0000-0000-000000000666",
          },
        })

        expect(createdSetting).not.toBeNull()
        expect(createdSetting?.id).not.toEqual("bogus")
        expect(createdSetting?.language).toEqual("fi")
        expect(createdSetting?.country).toEqual("en")
        expect(createdSetting?.marketing).toEqual(true)
        expect(createdSetting?.other).toEqual({
          isCat: true,
          sound: "meow",
        })
      })

      it("updates correctly, filters unwanted fields and shoves other fields to other, updating existing ones", async () => {
        const existingSetting = await ctx.prisma.userCourseSetting.findFirst({
          where: {
            id: "40000000-0000-0000-0000-000000000102",
          },
        })

        const res = await postSettings("course1")({
          data: {
            id: "bogus",
            language: "fi",
            country: "en",
            marketing: true,
            isCat: true,
            sound: "meow",
          },
          headers: { Authorization: "Bearer admin" },
        })

        expect(res.data.message).toContain("settings updated")
        expect(res.status).toBe(200)

        const updatedSetting = await ctx.prisma.userCourseSetting.findFirst({
          where: {
            id: "40000000-0000-0000-0000-000000000102",
          },
        })

        expect(updatedSetting!.updated_at! > existingSetting!.updated_at!).toBe(
          true,
        )
        expect(updatedSetting!.language).toBe("fi")
        expect(updatedSetting!.country).toBe("en")
        expect(updatedSetting!.marketing).toBe(true)
        expect(updatedSetting!.other).toEqual({
          hasWings: true,
          isCat: true,
          sound: "meow",
        })
      })
    })

    describe("/api/completions", () => {
      const tmc = fakeTMCCurrent({
        "Bearer normal": [200, normalUserDetails],
        "Bearer admin": [200, adminUserDetails],
      })

      beforeAll(() => tmc.setup())
      afterAll(() => tmc.teardown())

      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      const getCompletions = (slug: string, registered: boolean = false) =>
        get(
          `/api/completions/${slug}${
            registered ? `?registered=${registered}` : ""
          }`,
          {},
        )

      it("errors on no auth", async () => {
        return getCompletions("course1")({})
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(401)
          })
      })

      it("errors on non-existent organization", async () => {
        return getCompletions("course1")({
          headers: { Authorization: "Basic bogus" },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(401)
          })
      })

      it("errors on non-basic authorization", async () => {
        return getCompletions("course1")({
          headers: { Authorization: "Bearer admin" },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(401)
          })
      })

      it("errors on non-existent course", async () => {
        return getCompletions("bogus")({
          headers: { Authorization: "Basic kissa" },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(404)
            expect(response.data.message).toContain("Course not found")
          })
      })

      it("returns correctly on course, skipping registered completions", async () => {
        const res = await getCompletions("course1")({
          headers: { Authorization: "Basic kissa" },
        })

        const completions = orderBy(res.data, "id")

        expect(completions.map((c) => c.id)).toEqual([
          "12400000-0000-0000-0000-000000000001",
          "30000000-0000-0000-0000-000000000102",
          "30000000-0000-0000-0000-000000000104",
        ])
      })

      it("returns correctly on course alias, skipping registered completions", async () => {
        const res = await getCompletions("alias")({
          headers: { Authorization: "Basic kissa" },
        })

        const completions = orderBy(res.data, "id")

        expect(completions.map((c) => c.id)).toEqual([
          "12400000-0000-0000-0000-000000000001",
          "30000000-0000-0000-0000-000000000102",
          "30000000-0000-0000-0000-000000000104",
        ])
      })

      it("returns correctly on course when registered query parameter is set", async () => {
        const res = await getCompletions(
          "course1",
          true,
        )({
          headers: { Authorization: "Basic kissa" },
        })

        const completions = orderBy(res.data, "id")

        expect(completions.map((c) => c.id)).toEqual([
          "12400000-0000-0000-0000-000000000001",
          "30000000-0000-0000-0000-000000000102",
          "30000000-0000-0000-0000-000000000104",
          "30000000-0000-0000-0000-000000000105",
        ])
      })

      const completionInstructions = get(
        "/api/completionInstructions/course1/en",
        {},
      )

      it("returns course instructions", async () => {
        const res = await completionInstructions({})

        expect(res.status).toBe(200)
      })

      const completionTiers = get("/api/completionTiers/course1", {})

      it("returns course with multiple tiered registration links", async () => {
        const res = await completionTiers({
          headers: { Authorization: "Bearer normal" },
        })

        expect(res.status).toBe(200)
      })
    })
  })

  describe("/ab-studies", () => {
    const tmc = fakeTMCCurrent({
      "Bearer normal": [200, normalUserDetails],
      "Bearer admin": [200, adminUserDetails],
    })

    beforeAll(() => tmc.setup())
    afterAll(() => tmc.teardown())

    beforeEach(async () => {
      await seed(ctx.prisma)
    })

    const getStudy = (id?: string) => get(`/api/ab-studies/${id ?? ""}`, {})

    const okStudyId = "99000000-0000-0000-0000-000000000001"
    const okStudyId2 = "99000000-0000-0000-0000-000000000002"
    const fakeStudyId = "99000000-0000-0000-0000-000000000003"

    it("errors on no auth", async () => {
      return getStudy(okStudyId)({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on non-admin", async () => {
      return getStudy(okStudyId)({
        headers: {
          Authorization: "Bearer normal",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("returns empty on non-existent study", async () => {
      const response = await getStudy(fakeStudyId)({
        headers: {
          Authorization: "Bearer admin",
        },
      })

      expect(response.status).toBe(200)
      expect(response.data).toBeNull()
    })

    it("returns existing study", async () => {
      const response = await getStudy(okStudyId)({
        headers: {
          Authorization: "Bearer admin",
        },
      })

      expect(response.status).toBe(200)
      expect((response.data as any).id).toEqual(okStudyId)
    })

    it("returns all studies on no id given", async () => {
      const response = await getStudy()({
        headers: {
          Authorization: "Bearer admin",
        },
      })

      expect(response.status).toBe(200)
      expect(Array.isArray(response.data)).toBe(true)

      const ids = response.data.map((d: any) => d.id)
      expect(ids.length).toBe(2)
      expect(ids).toContain(okStudyId)
      expect(ids).toContain(okStudyId2)
    })
  })

  describe("/ab-enrollments", () => {
    const tmc = fakeTMCCurrent({
      "Bearer normal": [200, normalUserDetails],
      "Bearer admin": [200, adminUserDetails],
    })

    beforeAll(() => tmc.setup())
    afterAll(() => tmc.teardown())

    beforeEach(async () => {
      await seed(ctx.prisma)
    })

    const getEnrollment = (id: string) => get(`/api/ab-enrollments/${id}`, {})

    const okStudyId = "99000000-0000-0000-0000-000000000001"
    const okStudyId2 = "99000000-0000-0000-0000-000000000002"
    const fakeStudyId = "99000000-0000-0000-0000-000000000003"

    it("errors on no auth", async () => {
      return getEnrollment(okStudyId)({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on non-existent ab_study_id", async () => {
      return getEnrollment(fakeStudyId)({
        headers: {
          Authorization: "Bearer normal",
        },
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(400)
          expect(response.data.message).toContain("not found")
        })
    })

    it("returns existing enrollment", async () => {
      const countBefore = await ctx.knex.count("*").from("ab_enrollment")

      const existingEnrollmentResponse = await getEnrollment(okStudyId2)({
        headers: {
          Authorization: "Bearer admin",
        },
      })

      const countAfter = await ctx.knex.count("*").from("ab_enrollment")
      expect(countBefore).toEqual(countAfter)

      expect(existingEnrollmentResponse.status).toBe(200)
      expect(existingEnrollmentResponse.data.group).toBe(2)
    })

    it("creates enrollment and returns the created one on future calls", async () => {
      const createdEnrollmentResponse = await getEnrollment(okStudyId)({
        headers: {
          Authorization: "Bearer normal",
        },
      })

      expect(createdEnrollmentResponse.status).toBe(200)
      expect(createdEnrollmentResponse.data).not.toBeNull()

      for (let i = 0; i < 10; i++) {
        const enrollmentResponse = await getEnrollment(okStudyId)({
          headers: {
            Authorization: "Bearer normal",
          },
        })

        expect(enrollmentResponse.data).toEqual(createdEnrollmentResponse.data)
      }
    })
  })

  describe("/user-course-progress", () => {
    const tmc = fakeTMCCurrent({
      "Bearer normal": [200, normalUserDetails],
      "Bearer third": [200, { ...normalUserDetails, id: 3 }],
    })

    beforeAll(() => tmc.setup())
    afterAll(() => tmc.teardown())

    beforeEach(async () => {
      await seed(ctx.prisma)
    })

    const getUserCourseProgress = (slug: string) =>
      get(`/api/user-course-progress/${slug}`, {})

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

  describe("/user/update-from-tmc", () => {
    beforeEach(async () => {
      process.env.TMC_UPDATE_SECRET = "secret"
      await seed(ctx.prisma)
    })

    const postUpdateUserFromTMC = post("/api/user/update-from-tmc", {})

    it("errors on auth error", async () => {
      try {
        await postUpdateUserFromTMC({
          data: { upstream_id: 1, secret: "secret" },
        })

        fail()
      } catch (err: any) {
        const { response } = err
        expect(response.status).toBe(403)
        expect(response.data.success).toBe(false)
        expect(response.data.message).toBe("Not logged in.")
      }
    })

    it("errors on invalid secret", async () => {
      try {
        await postUpdateUserFromTMC({
          data: { upstream_id: 1, secret: "foo" },
          headers: { authorization: "Bearer ok" },
        })

        fail()
      } catch (err: any) {
        const { response } = err
        expect(response.status).toBe(405)
        expect(response.data.success).toBe(false)
        expect(response.data.message).toBe("Not allowed")
      }
    })

    it("errors on no upstream_id", async () => {
      try {
        await postUpdateUserFromTMC({
          data: { secret: "secret" },
          headers: { authorization: "Bearer ok" },
        })

        fail()
      } catch (err: any) {
        const { response } = err
        expect(response.status).toBe(400)
        expect(response.data.success).toBe(false)
        expect(response.data.message).toBe("No upstream_id provided")
      }
    })

    it("updates upstream_id", async () => {
      const before = await ctx.prisma.user.findUnique({
        where: {
          id: "20000000000000000000000000000102",
        },
      })
      expect(before?.upstream_id).toBe(1)

      const res = await postUpdateUserFromTMC({
        data: { upstream_id: 666, secret: "secret" },
        headers: { authorization: "Bearer ok" },
      })

      expect(res.status).toBe(200)
      expect(res.data.message).toBe("User upstream_id updated")
      expect(res.data.upstream_id).toBe(666)

      const after = await ctx.prisma.user.findUnique({
        where: {
          id: "20000000000000000000000000000102",
        },
      })
      expect(after?.upstream_id).toBe(666)
    })

    it("returns 500 on update error", async () => {
      const mockCtx = {
        ...ctx,
        prisma: {
          ...ctx.prisma,
          user: {
            ...ctx.prisma.user,
            update: async () => {
              throw new Error()
            },
          },
        },
      }

      await updateUserFromTMC(mockCtx as any)(
        {
          headers: {
            authorization: "Bearer ok",
          },
          body: {
            upstream_id: 1,
            secret: "secret",
          },
        } as any,
        {
          status: (code: number) => ({
            json: (json: any) => {
              expect(code).toBe(500)
              expect(json.message).toBe("User update not successful")
            },
          }),
        } as any,
      )
    })
  })
})
