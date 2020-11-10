import { gql } from "graphql-request"
import TmcClient from "../services/tmc"
import { getTestContext } from "./__helpers"
import {
  course,
  normalUser,
  normalUserDetails,
  adminUser,
  adminUserDetails,
} from "./data"

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

describe("course queries", () => {
  describe("course", () => {
    let courseId: string | null = null

    beforeEach(async () => {
      console.log("course beforeEach", ctx.version)
      /*while (!ctx.prisma || !ctx.client) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }*/
      const newCourse = await ctx.prisma.course.create({
        data: course,
      })
      courseId = newCourse.id
    })

    it("returns course on id", async () => {
      jest
        .spyOn(TmcClient.prototype, "getCurrentUserDetails")
        .mockImplementation(async () => normalUserDetails)
      ctx!.client.setHeader("Authorization", "Bearer 12345")

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
