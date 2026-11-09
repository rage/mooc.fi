import { gql } from "graphql-request"

import {
  FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  setupTMCWithDefaultFakeUsers,
} from "../../tests"
import { seed } from "../../tests/data/seed"

jest.mock("../../services/kafkaProducer")

const ctx = getTestContext()

const addCourseOrganizationMutation = gql`
  mutation AddCourseOrganization($course_id: ID!, $organization_id: ID!) {
    addCourseOrganization(
      course_id: $course_id
      organization_id: $organization_id
      creator: true
    ) {
      id
    }
  }
`

const variables = {
  course_id: "00000000000000000000000000000002",
  organization_id: "10000000000000000000000000000102",
}

describe("addCourseOrganization authorization", () => {
  setupTMCWithDefaultFakeUsers()

  beforeEach(async () => {
    await seed(ctx.prisma)
    await ctx.prisma.courseOrganization.deleteMany({
      where: {
        course_id: variables.course_id,
        organization_id: variables.organization_id,
      },
    })
  })

  it.each([
    ["anonymous callers", {}],
    ["normal users", FAKE_NORMAL_USER_AUTHORIZATION_HEADERS],
  ])("refuses %s", async (_, headers) => {
    await expect(
      ctx.client.request(addCourseOrganizationMutation, variables, headers),
    ).rejects.toThrow(/Not authorized/)
    expect(
      await ctx.prisma.courseOrganization.count({ where: variables }),
    ).toBe(0)
  })

  it("lets admins add a course organization", async () => {
    const res = await ctx.client.request<any>(
      addCourseOrganizationMutation,
      variables,
      FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
    )

    expect(res.addCourseOrganization.id).toBeDefined()
  })
})
