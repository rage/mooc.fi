import { gql } from "graphql-request"

import {
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  grantOwnership,
  setupTMCWithDefaultFakeUsers,
} from "../../tests"
import { seed } from "../../tests/data/seed"

const ctx = getTestContext()

const course1Id = "00000000000000000000000000000002"
const course2Id = "00000000000000000000000000000001"
const settingsSourceId = "00000000000000000000000000000666"
const inheritingId = "00000000000000000000000000000668"

const userCourseSettingsQuery = gql`
  query UserCourseSettings($course_id: ID, $user_upstream_id: Int) {
    userCourseSettings(
      course_id: $course_id
      user_upstream_id: $user_upstream_id
      first: 50
    ) {
      edges {
        node {
          id
        }
      }
    }
  }
`

const userCourseProgressesQuery = gql`
  query UserCourseProgresses($course_slug: String, $course_id: ID) {
    userCourseProgresses(course_slug: $course_slug, course_id: $course_id) {
      id
    }
  }
`

describe("course points as a course owner", () => {
  setupTMCWithDefaultFakeUsers()

  beforeEach(async () => {
    await seed(ctx.prisma)
  })

  describe("userCourseSettings", () => {
    it("lists their course's settings", async () => {
      const res = await ctx.client.request<any>(
        userCourseSettingsQuery,
        { course_id: course2Id },
        FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
      )

      expect(res.userCourseSettings.edges.length).toBeGreaterThan(0)
    })

    it("refuses another course's settings", async () => {
      await expect(
        ctx.client.request(
          userCourseSettingsQuery,
          { course_id: course1Id },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        ),
      ).rejects.toThrow(/Not authorized/)
    })

    it("refuses listing without a course", async () => {
      await expect(
        ctx.client.request(
          userCourseSettingsQuery,
          { user_upstream_id: 3 },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        ),
      ).rejects.toThrow(/Not authorized/)
    })

    it("refuses settings inherited from a course they don't own", async () => {
      await grantOwnership(ctx.prisma, inheritingId)

      await expect(
        ctx.client.request(
          userCourseSettingsQuery,
          { course_id: inheritingId },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        ),
      ).rejects.toThrow(/Not authorized/)
    })

    it("lists settings inherited from a course they own", async () => {
      await grantOwnership(ctx.prisma, settingsSourceId)

      const res = await ctx.client.request<any>(
        userCourseSettingsQuery,
        { course_id: inheritingId },
        FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
      )

      expect(
        res.userCourseSettings.edges.map((edge: any) => edge.node.id),
      ).toEqual(["40000000-0000-0000-0000-000000000105"])
    })
  })

  describe("userCourseProgresses", () => {
    it("lists their course's progresses by slug and by id", async () => {
      await grantOwnership(ctx.prisma, course1Id)

      const bySlug = await ctx.client.request<any>(
        userCourseProgressesQuery,
        { course_slug: "course1" },
        FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
      )
      const byId = await ctx.client.request<any>(
        userCourseProgressesQuery,
        { course_id: course1Id },
        FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
      )

      expect(bySlug.userCourseProgresses.length).toBeGreaterThan(0)
      expect(byId.userCourseProgresses).toEqual(bySlug.userCourseProgresses)
    })

    it("refuses another course's progresses", async () => {
      await expect(
        ctx.client.request(
          userCourseProgressesQuery,
          { course_slug: "course1" },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        ),
      ).rejects.toThrow(/Not authorized/)
    })

    it("refuses a slug they don't own even with an owned course_id", async () => {
      await expect(
        ctx.client.request(
          userCourseProgressesQuery,
          { course_slug: "course1", course_id: course2Id },
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        ),
      ).rejects.toThrow(/Not authorized/)
    })
  })
})
