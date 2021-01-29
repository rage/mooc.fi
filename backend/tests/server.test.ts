import { fakeTMC, getTestContext } from "./__helpers"
import { normalUserDetails, adminUserDetails } from "./data"
import { seed } from "./data/seed"
import axios, { Method } from "axios"

const ctx = getTestContext()

describe("server", () => {
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

  describe("/api/register-completions", () => {
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

      expect(addedCompletions).toMatchSnapshot([
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

  describe("/api/user-course-settings", () => {
    const tmc = fakeTMC({
      "Bearer normal": [200, normalUserDetails],
      "Bearer admin": [200, adminUserDetails],
    })
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
        headers: { Authorization: "Bearer normal" },
      }).then((res) => {
        expect(res.data).toBeNull()
      })
    })

    it("returns null with course with no settings", async () => {
      return getSettings("course2")({
        headers: { Authorization: "Bearer normal" },
      }).then((res) => {
        expect(res.data).toBeNull()
      })
    })

    it("returns settings correctly", async () => {
      return getSettings("course1")({
        headers: { Authorization: "Bearer admin" },
      }).then(async (res) => {
        const expected = await ctx.prisma.userCourseSetting.findFirst({
          where: {
            id: "40000000-0000-0000-0000-000000000102",
          },
        })
        expect(res.data).toEqual(JSON.parse(JSON.stringify(expected)))
      })
    })
  })
})
