import { getTestContext } from "./__helpers"
import { seed } from "./data/seed"
import axios from "axios"

const ctx = getTestContext()

describe("server", () => {
  const post = (route: string = "", defaultHeaders: any) => async (
    data: any,
    headers: any = defaultHeaders,
  ) =>
    await axios.post(`http://localhost:${ctx.port}${route}`, data, { headers })

  describe("/api/register-completions", () => {
    const defaultHeaders = {
      Authorization: "Basic kissa",
    }
    const postCompletions = post("/api/register-completions", defaultHeaders)

    beforeEach(async () => {
      await seed(ctx.prisma)
    })

    it("errors on wrong authorization", async () => {
      return postCompletions({ foo: 1 }, { Authorization: "foo" })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on non-existent secret", async () => {
      return postCompletions({ foo: 1 }, { Authorization: "Basic koira" })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on no completions", async () => {
      return postCompletions({ foo: 1 })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(400)
        })
    })

    it("errors on malformed completion", async () => {
      return postCompletions({
        completions: [
          {
            foo: 1,
          },
        ],
      })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(403)
        })
    })

    it("creates registered completions", async () => {
      const res = await postCompletions({
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
})
