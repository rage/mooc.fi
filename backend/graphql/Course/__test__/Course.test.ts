import { gql } from "graphql-request"
import { orderBy } from "lodash"

import {
  FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  setupTMCWithDefaultFakeUsers,
} from "../../../tests"
import { seed } from "../../../tests/data/seed"

jest.mock("../../../services/kafkaProducer")

const ctx = getTestContext()

const courseCompletionsQuery = gql`
  query courseCompletions(
    $slug: String
    $user_id: String
    $user_upstream_id: Int
  ) {
    course(slug: $slug) {
      id
      slug
      name
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
      slug
      name
      tags(
        language: $language
        types: $types
        search: $search
        includeHidden: $includeHidden
      ) {
        id
        name
        description
        abbreviation
        hidden
        types
        tag_translations {
          language
          name
          description
          abbreviation
        }
      }
    }
  }
`

const courseSponsorsQuery = gql`
  query courseSponsors($slug: String, $language: String) {
    course(slug: $slug, language: $language) {
      id
      slug
      name
      sponsors(language: $language) {
        id
        name
        translations {
          language
          name
          description
          link
          link_text
        }
        images {
          type
          width
          height
          uri
        }
      }
    }
  }
`

describe("Course", () => {
  afterAll(() => jest.clearAllMocks())

  describe("model", () => {
    setupTMCWithDefaultFakeUsers()

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
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
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
            FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
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
        const res = await ctx.client.request<any>(
          courseCompletionsQuery,
          {
            slug: "course1",
            user_id: "20000000000000000000000000000103",
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        expect({
          ...res,
          completions: orderBy(res.completions, "id"),
        }).toMatchSnapshot()
      })

      it("works with user_upstream_id", async () => {
        const res = await ctx.client.request<any>(
          courseCompletionsQuery,
          {
            slug: "course1",
            user_upstream_id: 1,
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        )

        expect({
          ...res,
          completions: orderBy(res.completions, "id"),
        }).toMatchSnapshot()
      })

      it("shouldn't return anything with non-existent user", async () => {
        const res = await ctx.client.request<any>(
          courseCompletionsQuery,
          {
            slug: "course1",
            user_upstream_id: 4939298,
          },
          FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
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
              FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
            )
            fail()
          } catch (e: any) {
            expect(e.response.errors?.length).toBe(1)
          }
        })

        it("should return name, description and abbreviation in root when language provided", async () => {
          const res = await ctx.client.request<any>(
            courseTagsQuery,
            {
              slug: "course1",
              language: "en_US",
            },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )

          const received = orderBy(res.course?.tags ?? [], "id")

          expect(received.length).toBe(2)
          expect(received[0].name).toBe("tag1 in english")
          expect(received[0].description).toBe("tag1 description")
          expect(received[0].abbreviation).toBe("tag1_en")
          expect(received[0].types).toContain("type1")
          expect(received[1].name).toBe("tag2 in english")
          expect(received[1].description).toBe("tag2 description")
          expect(received[1].types).toEqual(
            expect.arrayContaining(["type1", "type2"]),
          )
          expect(received[1].types.length).toEqual(2)
        })

        it("should not return hidden tags", async () => {
          const res = await ctx.client.request<any>(
            courseTagsQuery,
            {
              slug: "course2",
              language: "fi_FI",
            },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )

          expect(res.course?.tags?.length).toBe(0)
        })

        it("should only return search matches", async () => {
          const res = await ctx.client.request<any>(
            courseTagsQuery,
            {
              slug: "course1",
              language: "fi_FI",
              search: "mUuTa",
            },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )

          expect(res.course?.tags?.length).toBe(1)
          expect(res.course?.tags[0].name).toBe("tag2 suomeksi")
        })

        it("should only return chosen types", async () => {
          const res = await ctx.client.request<any>(
            courseTagsQuery,
            {
              slug: "course1",
              language: "fi_FI",
              types: ["type2"],
            },
            FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          )

          expect(res.course?.tags?.length).toBe(1)
          expect(res.course?.tags[0].name).toBe("tag2 suomeksi")
        })
      })

      describe("admin", () => {
        it("should return hidden tags", async () => {
          const res = await ctx.client.request<any>(
            courseTagsQuery,
            {
              slug: "course2",
              language: "fi_FI",
              includeHidden: true,
            },
            FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
          )

          expect(res.course?.tags?.length).toBe(1)
          expect(res.course?.tags[0].name).toBe("piilotettu tag3")
        })
      })
    })

    describe("sponsors", () => {
      beforeEach(async () => {
        await seed(ctx.prisma)
      })

      it("should return all if no language given", async () => {
        const res = await ctx.client.request<any>(
          courseSponsorsQuery,
          {
            slug: "course2",
          },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )
        expect(res.course?.sponsors?.length).toBe(2)
      })

      it("should only return sponsors with given language", async () => {
        const res = await ctx.client.request<any>(
          courseSponsorsQuery,
          {
            slug: "course2",
            language: "fi_FI",
          },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )
        expect(res.course?.sponsors?.length).toBe(1)
        expect(res.course?.sponsors[0].translations?.length).toBe(1)
        expect(res.course?.sponsors[0].translations[0].name).toBe("Sponsori 1")
      })
    })
  })
})
