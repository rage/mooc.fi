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

const courseTagsQuery = gql`
  query courseTags(
    $slug: String
    $language: String
    $types: [String!]
    $search: String
    $includeHidden: Boolean
  ) {
    course(slug: $slug, language: $language) {
      id
      tags(
        language: $language
        types: $types
        search: $search
        includeHidden: $includeHidden
      ) {
        id
        name
        description
        hidden
        types
        tag_translations {
          language
          name
          description
        }
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

    describe("tags", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      describe("normal user", () => {
        it("should error when includeHidden provided", async () => {
          try {
            await ctx.client.request(
              courseTagsQuery,
              {
                slug: "course1",
                includeHidden: true,
              },
              {
                Authorization: "Bearer normal",
              },
            )
            fail()
          } catch (e: any) {
            expect(e.response.errors?.length).toBe(1)
          }
        })

        it("should return name and description in root when language provided", async () => {
          const res = await ctx.client.request(
            courseTagsQuery,
            {
              slug: "course1",
              language: "en_US",
            },
            {
              Authorization: "Bearer normal",
            },
          )

          const received = orderBy(res.course?.tags ?? [], "id")

          expect(received.length).toBe(2)
          expect(received[0].name).toBe("tag1 in english")
          expect(received[0].description).toBe("tag1 description")
          expect(received[0].types).toContain("type1")
          expect(received[1].name).toBe("tag2 in english")
          expect(received[1].description).toBe("tag2 description")
          expect(received[1].types).toEqual(
            expect.arrayContaining(["type1", "type2"]),
          )
          expect(received[1].types.length).toEqual(2)
        })

        it("should not return hidden tags", async () => {
          const res = await ctx.client.request(
            courseTagsQuery,
            {
              slug: "course2",
              language: "fi_FI",
            },
            {
              Authorization: "Bearer normal",
            },
          )

          expect(res.course?.tags?.length).toBe(0)
        })

        it("should only return search matches", async () => {
          const res = await ctx.client.request(
            courseTagsQuery,
            {
              slug: "course1",
              language: "fi_FI",
              search: "mUuTa",
            },
            {
              Authorization: "Bearer normal",
            },
          )

          expect(res.course?.tags?.length).toBe(1)
          expect(res.course?.tags[0].name).toBe("tag2 suomeksi")
        })

        it("should only return chosen types", async () => {
          const res = await ctx.client.request(
            courseTagsQuery,
            {
              slug: "course1",
              language: "fi_FI",
              types: ["type2"],
            },
            {
              Authorization: "Bearer normal",
            },
          )

          expect(res.course?.tags?.length).toBe(1)
          expect(res.course?.tags[0].name).toBe("tag2 suomeksi")
        })
      })

      describe("admin", () => {
        it("should return hidden tags", async () => {
          const res = await ctx.client.request(
            courseTagsQuery,
            {
              slug: "course2",
              language: "fi_FI",
              includeHidden: true,
            },
            {
              Authorization: "Bearer admin",
            },
          )

          expect(res.course?.tags?.length).toBe(1)
          expect(res.course?.tags[0].name).toBe("piilotettu tag3")
        })
      })
    })
  })
})
