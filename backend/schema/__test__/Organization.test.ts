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

const organizationsRelationsQuery = gql`
  {
    organizations {
      id
      user_organizations {
        id
      }
      completions_registered {
        id
      }
      creator {
        id
      }
    }
  }
`

const organizationUserOrganizationsQuery = gql`
  query OrganizationUserOrganizations($id: String!) {
    organizations(take: 1, cursor: { id: $id }) {
      id
      user_organizations {
        id
      }
    }
  }
`

const ORGANIZATION_KISSA_HEADERS = { Authorization: "Basic kissa" }

describe("Organization relation authorization", () => {
  setupTMCWithDefaultFakeUsers()

  beforeEach(async () => {
    await seed(ctx.prisma)
    await ctx.prisma.userOrganization.create({
      data: {
        user: { connect: { id: "20000000000000000000000000000104" } },
        organization: { connect: { id: "10000000000000000000000000000102" } },
      },
    })
  })

  it("refuses anonymous callers", async () => {
    await expect(
      ctx.client.request(organizationsRelationsQuery),
    ).rejects.toThrow(/Not authorized/)
  })

  it("refuses normal users", async () => {
    await expect(
      ctx.client.request(
        organizationsRelationsQuery,
        {},
        FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
      ),
    ).rejects.toThrow(/Not authorized/)
  })

  it("lets admins read every organization's relations", async () => {
    const res = await ctx.client.request<any>(
      organizationsRelationsQuery,
      {},
      FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
    )

    expect(res.organizations.length).toBeGreaterThan(1)
    const userOrganizationIds = res.organizations.flatMap((o: any) =>
      o.user_organizations.map((uo: any) => uo.id),
    )
    expect(userOrganizationIds).toContain(
      "96900000-0000-0000-0000-000000000101",
    )
  })

  it("lets an organization read its own user_organizations", async () => {
    const res = await ctx.client.request<any>(
      organizationUserOrganizationsQuery,
      { id: "10000000000000000000000000000102" },
      ORGANIZATION_KISSA_HEADERS,
    )

    expect(res.organizations).toHaveLength(1)
    expect(res.organizations[0].user_organizations).toHaveLength(1)
  })

  it("refuses an organization reading another organization's user_organizations", async () => {
    await expect(
      ctx.client.request(
        organizationUserOrganizationsQuery,
        { id: "10000000000000000000000000000103" },
        ORGANIZATION_KISSA_HEADERS,
      ),
    ).rejects.toThrow(/Not authorized/)
  })
})
