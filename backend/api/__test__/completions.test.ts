import { orderBy } from "lodash"

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
  describe("/api/completions", () => {
    const tmc = fakeTMCCurrent({
      "Bearer normal": [200, normalUserDetails],
      "Bearer admin": [200, adminUserDetails],
    })

    beforeAll(() => tmc.setup())
    afterAll(() => tmc.teardown())

    let getCompletions: (slug: string, registered?: boolean) => RequestGet
    let completionInstructions: RequestGet
    let completionTiers: RequestGet

    beforeEach(async () => {
      await seed(ctx.prisma)
      const { get } = createRequestHelpers(ctx.port)
      getCompletions = (slug: string, registered: boolean = false) =>
        get(
          `/api/completions/${slug}${
            registered ? `?registered=${registered}` : ""
          }`,
          {},
        )
      completionInstructions = get("/api/completionInstructions/course1/en", {})
      completionTiers = get("/api/completionTiers/course1", {})
    })

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

    it("returns course instructions", async () => {
      const res = await completionInstructions({})

      expect(res.status).toBe(200)
    })

    it("returns course with multiple tiered registration links", async () => {
      const res = await completionTiers({
        headers: { Authorization: "Bearer normal" },
      })

      expect(res.status).toBe(200)
    })
  })
})
