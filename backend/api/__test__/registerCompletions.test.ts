import { orderBy } from "lodash"

import { createRequestHelpers, getTestContext, RequestPost } from "../../tests"
import { seed } from "../../tests/data"

const ctx = getTestContext()

describe("API", () => {
  describe("/register-completions", () => {
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
})
