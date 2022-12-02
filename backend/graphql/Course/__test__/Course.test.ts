import { gql } from "graphql-request"
import { orderBy } from "lodash"

import { fakeTMCCurrent, getTestContext } from "../../../tests"
import { adminUserDetails, normalUserDetails } from "../../../tests/data"
import { seed } from "../../../tests/data/seed"

jest.mock("../../../services/kafkaProducer")

const ctx = getTestContext()
const tmc = fakeTMCCurrent({
  "Bearer normal": [200, normalUserDetails],
  "Bearer admin": [200, adminUserDetails],
})

const courseCompletionsQuery = gql`
  query courseCompletions(
    $slug: String
    $user_id: String
    $user_upstream_id: Int
  ) {
    course(slug: $slug) {
      id
      completions(user_id: $user_id, user_upstream_id: $user_upstream_id) {
        id
        user {
          id
          username
        }
        completion_language
        email
        user_upstream_id
      }
    }
  }
`

describe("Course", () => {
  afterAll(() => jest.clearAllMocks())

  describe("model", () => {
    beforeAll(() => tmc.setup())
    afterAll(() => tmc.teardown())

    describe("completions", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      it("errors on no admin", async () => {
        return ctx.client
          .request(
            courseCompletionsQuery,
            {
              slug: "course1",
              user_upstream_id: 1,
            },
            {
              Authorization: "Bearer normal",
            },
          )
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.errors?.length).toBe(1)
            expect(response.errors[0].message).toContain("Not authorized")
            expect(response.status).toBe(200)
          })
      })

      it("errors with no user_id or user_upstream_id", async () => {
        return ctx.client
          .request(
            courseCompletionsQuery,
            {
              slug: "course1",
            },
            {
              Authorization: "Bearer admin",
            },
          )
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.errors?.length).toBe(1)
            expect(response.errors[0].message).toContain(
              "needs user_id or user_upstream_id",
            )
            expect(response.status).toBe(200)
          })
      })

      it("works with user_id", async () => {
        const res = await ctx.client.request(
          courseCompletionsQuery,
          {
            slug: "course1",
            user_id: "20000000000000000000000000000103",
          },
          {
            Authorization: "Bearer admin",
          },
        )

        expect({
          ...res,
          completions: orderBy(res.completions, "id"),
        }).toMatchSnapshot()
      })

      it("works with user_upstream_id", async () => {
        const res = await ctx.client.request(
          courseCompletionsQuery,
          {
            slug: "course1",
            user_upstream_id: 1,
          },
          {
            Authorization: "Bearer admin",
          },
        )

        expect({
          ...res,
          completions: orderBy(res.completions, "id"),
        }).toMatchSnapshot()
      })

      it("shouldn't return anything with non-existent user", async () => {
        const res = await ctx.client.request(
          courseCompletionsQuery,
          {
            slug: "course1",
            user_upstream_id: 4939298,
          },
          {
            Authorization: "Bearer admin",
          },
        )

        expect({
          ...res,
          completions: orderBy(res.completions, "id"),
        }).toMatchSnapshot()
      })
    })
  })
})
