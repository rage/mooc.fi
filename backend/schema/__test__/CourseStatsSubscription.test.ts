import { gql } from "graphql-request"

import {
  FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  setupTMCWithDefaultFakeUsers,
} from "../../tests"
import { seed } from "../../tests/data/seed"

jest.mock("../../services/kafkaProducer")

const ctx = getTestContext()

const createCourseStatsSubscriptionMutation = gql`
  mutation CreateCourseStatsSubscription($id: ID!) {
    createCourseStatsSubscription(id: $id) {
      id
      email_template_id
    }
  }
`

describe("createCourseStatsSubscription", () => {
  setupTMCWithDefaultFakeUsers()

  let ownedStatsTemplateId: string
  let unownedStatsTemplateId: string
  let thresholdTemplateId: string

  beforeEach(async () => {
    await seed(ctx.prisma)

    const createStatsTemplate = async (courseSlug: string) => {
      const template = await ctx.prisma.emailTemplate.create({
        data: { name: `${courseSlug} stats`, template_type: "course-stats" },
      })
      await ctx.prisma.course.update({
        where: { slug: courseSlug },
        data: { course_stats_email: { connect: { id: template.id } } },
      })
      return template.id
    }

    // The normal user owns course2 in the seed.
    ownedStatsTemplateId = await createStatsTemplate("course2")
    unownedStatsTemplateId = await createStatsTemplate("course1")
    thresholdTemplateId = (
      await ctx.prisma.emailTemplate.findFirstOrThrow({
        where: { template_type: "threshold" },
      })
    ).id
  })

  it("refuses anonymous callers", async () => {
    await expect(
      ctx.client.request(createCourseStatsSubscriptionMutation, {
        id: ownedStatsTemplateId,
      }),
    ).rejects.toThrow(/Not authorized/)
  })

  it("lets a course owner subscribe to their course's stats template", async () => {
    const res = await ctx.client.request<any>(
      createCourseStatsSubscriptionMutation,
      { id: ownedStatsTemplateId },
      FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
    )

    expect(res.createCourseStatsSubscription.email_template_id).toBe(
      ownedStatsTemplateId,
    )
  })

  it("refuses a normal user subscribing to another course's stats template", async () => {
    await expect(
      ctx.client.request(
        createCourseStatsSubscriptionMutation,
        { id: unownedStatsTemplateId },
        FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
      ),
    ).rejects.toThrow(/requires ownership/)
  })

  it("refuses a user who owns no course", async () => {
    await expect(
      ctx.client.request(
        createCourseStatsSubscriptionMutation,
        { id: ownedStatsTemplateId },
        FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
      ),
    ).rejects.toThrow(/requires ownership/)
  })

  it("refuses a template that is not a course stats template", async () => {
    await expect(
      ctx.client.request(
        createCourseStatsSubscriptionMutation,
        { id: thresholdTemplateId },
        FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
      ),
    ).rejects.toThrow(/not a course stats template/)
  })

  it("lets admins subscribe to any course stats template", async () => {
    const res = await ctx.client.request<any>(
      createCourseStatsSubscriptionMutation,
      { id: unownedStatsTemplateId },
      FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
    )

    expect(res.createCourseStatsSubscription.email_template_id).toBe(
      unownedStatsTemplateId,
    )
  })
})
