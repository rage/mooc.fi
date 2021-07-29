import { fakeTMCCurrent, getTestContext } from "../../tests/__helpers"
import {
  normalUserDetails,
  adminUserDetails,
  thirdUserDetails,
} from "../../tests/data"
import { seed } from "../../tests/data/seed"
import axios, { Method } from "axios"
import { omit, orderBy } from "lodash"

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
})
