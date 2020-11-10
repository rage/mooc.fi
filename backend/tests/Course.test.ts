import { gql } from "graphql-request"
import { getTestContext } from "./__helpers"
import {
  course,
  //normalUser,
  normalUserDetails,
  //adminUser,
  adminUserDetails,
} from "./data"
import nock from "nock"

const ctx = getTestContext()

const courseQuery = gql`
  query course($id: ID, $slug: String, $language: String) {
    course(id: $id, slug: $slug, language: $language) {
      id
      name
      slug
      description
      link
    }
  }
`

beforeAll(() => {
  nock("https://tmc.mooc.fi")
    .get("/api/v8/users/current?show_user_fields=1&extra_fields=1")
    .reply(function () {
      const auth = this.req.headers.authorization

      switch (auth) {
        case "Bearer normal":
          return [200, normalUserDetails]
        case "Bearer admin":
          return [200, adminUserDetails]
      }
    })
})

afterAll(() => nock.cleanAll())

describe("course queries", () => {
  describe("course", () => {
    let courseId: string | null = null

    beforeEach(async () => {
      const newCourse = await ctx.prisma.course.create({
        data: course,
      })
      courseId = newCourse.id
    })

    it("returns course on id", async () => {
      ctx!.client.setHeader("Authorization", "Bearer normal")

      const res = await ctx.client.request(courseQuery, {
        id: courseId,
      })

      expect(res).toMatchInlineSnapshot(
        {
          course: {
            id: expect.any(String),
            slug: "test",
            name: "test",
          },
        },
        `
        Object {
          "course": Object {
            "description": "",
            "id": Any<String>,
            "link": "",
            "name": "test",
            "slug": "test",
          },
        }
      `,
      )
      jest.restoreAllMocks()
    })
  })
})
