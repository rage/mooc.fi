import {
  createRequestHelpers,
  fakeTMCCurrent,
  getTestContext,
  RequestGet,
} from "../../tests/__helpers"
import { adminUserDetails, normalUserDetails } from "../../tests/data"
import { seed } from "../../tests/data/seed"

const ctx = getTestContext()
describe("API", () => {
  describe("/ab-studies", () => {
    const tmc = fakeTMCCurrent({
      "Bearer normal": [200, normalUserDetails],
      "Bearer admin": [200, adminUserDetails],
    })

    beforeAll(() => tmc.setup())
    afterAll(() => tmc.teardown())

    let getStudy: (id?: string) => RequestGet
    beforeEach(async () => {
      await seed(ctx.prisma)
      const { get } = createRequestHelpers(ctx.port)
      getStudy = (id?: string) => get(`/api/ab-studies/${id ?? ""}`, {})
    })

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

    let getEnrollment: (id: string) => RequestGet
    beforeEach(async () => {
      await seed(ctx.prisma)
      const { get } = createRequestHelpers(ctx.port)
      getEnrollment = (id: string) => get(`/api/ab-enrollments/${id}`, {})
    })

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
