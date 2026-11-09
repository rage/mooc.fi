import { gql } from "graphql-request"

import {
  FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  setupTMCWithDefaultFakeUsers,
} from "../../tests"
import { seed } from "../../tests/data/seed"

jest.mock("../../services/kafkaProducer")

const ctx = getTestContext()

const kissaId = "10000000-0000-0000-0000-000000000102"
const koiraId = "10000000-0000-0000-0000-000000000103"

const registeredCompletionsQuery = gql`
  query registeredCompletions($course: String, $take: Int) {
    registeredCompletions(course: $course, take: $take) {
      id
      organization_id
    }
  }
`

const createRegistrations = (organizationId: string, count: number) =>
  ctx.prisma.completionRegistered.createMany({
    data: Array.from({ length: count }, (_, index) => ({
      organization_id: organizationId,
      completion_id: "30000000-0000-0000-0000-000000000106",
      course_id: "00000000-0000-0000-0000-000000000002",
      user_id: "20000000-0000-0000-0000-000000000106",
      real_student_number: `${index}`,
    })),
  })

describe("registeredCompletions", () => {
  setupTMCWithDefaultFakeUsers()

  beforeEach(async () => {
    await seed(ctx.prisma)
    await createRegistrations(kissaId, 1)
    await createRegistrations(koiraId, 1)
  })

  it.each([{}, { course: "course1" }])(
    "returns only the calling organization's registrations with %j",
    async (variables) => {
      const res = await ctx.client.request<any>(
        registeredCompletionsQuery,
        variables,
        { Authorization: "Basic koira" },
      )

      expect(res.registeredCompletions).toEqual([
        { id: expect.any(String), organization_id: koiraId },
      ])
    },
  )

  it("returns every organization's registrations to admins", async () => {
    const res = await ctx.client.request<any>(
      registeredCompletionsQuery,
      {},
      FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
    )

    expect(
      res.registeredCompletions.map((r: any) => r.organization_id),
    ).toEqual(expect.arrayContaining([kissaId, koiraId]))
  })

  it("returns at most 50 items without take", async () => {
    await createRegistrations(koiraId, 60)

    const res = await ctx.client.request<any>(
      registeredCompletionsQuery,
      {},
      { Authorization: "Basic koira" },
    )

    expect(res.registeredCompletions).toHaveLength(50)
  })

  it("pages in created_at, then id order", async () => {
    await ctx.prisma.completionRegistered.deleteMany()
    const registrations = [
      ["00000000-0000-0000-0000-00000000c003", "2020-01-02T00:00:00Z"],
      ["00000000-0000-0000-0000-00000000c002", "2020-01-01T00:00:00Z"],
      ["00000000-0000-0000-0000-00000000c001", "2020-01-01T00:00:00Z"],
    ]
    await ctx.prisma.completionRegistered.createMany({
      data: registrations.map(([id, created_at]) => ({
        id,
        created_at,
        organization_id: koiraId,
        completion_id: "30000000-0000-0000-0000-000000000106",
        course_id: "00000000-0000-0000-0000-000000000002",
        user_id: "20000000-0000-0000-0000-000000000106",
        real_student_number: id,
      })),
    })

    const page = async (skip: number) =>
      (
        await ctx.client.request<any>(
          gql`
            query ($skip: Int) {
              registeredCompletions(skip: $skip, take: 2) {
                id
              }
            }
          `,
          { skip },
          { Authorization: "Basic koira" },
        )
      ).registeredCompletions.map((r: { id: string }) => r.id)

    expect([...(await page(0)), ...(await page(2))]).toEqual([
      "00000000-0000-0000-0000-00000000c001",
      "00000000-0000-0000-0000-00000000c002",
      "00000000-0000-0000-0000-00000000c003",
    ])
  })

  it.each([-1, 0, 51])("rejects take %d", async (take) => {
    await expect(
      ctx.client.request(
        registeredCompletionsQuery,
        { take },
        { Authorization: "Basic koira" },
      ),
    ).rejects.toThrow("take must be between 1 and 50")
  })
})
