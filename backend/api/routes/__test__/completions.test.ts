import { orderBy } from "lodash"

import {
  createRequestHelpers,
  fakeTMCCurrent,
  getTestContext,
  ID_REGEX,
  RequestGet,
  RequestPost,
} from "../../../tests"
import { adminUserDetails, normalUserDetails, seed } from "../../../tests/data"

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
    let getCompletionInstructions: RequestGet
    let getCompletionTiers: RequestGet

    beforeEach(async () => {
      await seed(ctx.prisma)
      const { get } = createRequestHelpers(ctx.port)
      getCompletions = (slug: string, registered = false) =>
        get(
          `/api/completions/${slug}${
            registered ? `?registered=${registered}` : ""
          }`,
          {},
        )
      getCompletionInstructions = get(
        "/api/completionInstructions/course1/en",
        {},
      )
      getCompletionTiers = get("/api/completionTiers/course1", {})
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

    it("returns correctly on course, skipping registered and duplicate completions", async () => {
      const res = await getCompletions("course1")({
        headers: { Authorization: "Basic kissa" },
      })

      expect((res.data as any[]).map((c) => c.id).sort()).toEqual([
        "12400000-0000-0000-0000-000000000001",
        "30000000-0000-0000-0000-000000000102",
        "30000000-0000-0000-0000-000000000104",
      ])
    })

    it("returns correctly on course alias, skipping registered and duplicate completions", async () => {
      const res = await getCompletions("alias")({
        headers: { Authorization: "Basic kissa" },
      })

      expect((res.data as any[]).map((c) => c.id).sort()).toEqual([
        "12400000-0000-0000-0000-000000000001",
        "30000000-0000-0000-0000-000000000102",
        "30000000-0000-0000-0000-000000000104",
      ])
    })

    it("returns correctly on course when registered query parameter is set, skipping duplicate completions", async () => {
      const res = await getCompletions(
        "course1",
        true,
      )({
        headers: { Authorization: "Basic kissa" },
      })

      expect((res.data as any[]).map((c) => c.id).sort()).toEqual([
        "12400000-0000-0000-0000-000000000001",
        "30000000-0000-0000-0000-000000000102",
        "30000000-0000-0000-0000-000000000104",
        "30000000-0000-0000-0000-000000000106",
      ])
    })

    it("returns correctly on course with a completion handler", async () => {
      const res = await getCompletions("handled")({
        headers: { Authorization: "Basic kissa" },
      })

      expect((res.data as any[]).map((c) => c.id).sort()).toEqual([
        "30000000-0000-0000-0000-000000000107",
      ])
    })

    it("returns course instructions", async () => {
      const res = await getCompletionInstructions({})

      expect(res.status).toBe(200)
    })

    it("returns course with multiple tiered registration links", async () => {
      const res = await getCompletionTiers({
        headers: { Authorization: "Bearer normal" },
      })

      expect(res.status).toBe(200)
    })
  })

  describe("/api/register-completions", () => {
    const defaultHeaders = {
      Authorization: "Basic kissa",
    }

    let postCompletions: RequestPost

    beforeEach(async () => {
      await seed(ctx.prisma)
      const { post } = createRequestHelpers(ctx.port)
      postCompletions = post("/api/register-completions", defaultHeaders)
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
          expect(response.status).toBe(400)
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

      expect({
        addedCompletions: orderBy(addedCompletions, "completion_id"),
      }).toMatchSnapshot({
        addedCompletions: [
          {
            id: expect.stringMatching(ID_REGEX),
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
          },
          {
            id: expect.stringMatching(ID_REGEX),
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
          },
        ],
      })
    })
  })
})
