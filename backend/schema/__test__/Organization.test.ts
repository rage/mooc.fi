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

describe("organization lookup", () => {
  setupTMCWithDefaultFakeUsers()

  beforeEach(async () => {
    await seed(ctx.prisma)
  })

  it("finds organizations whose hidden flag is unset", async () => {
    await ctx.prisma.organization.update({
      where: { slug: "test" },
      data: { hidden: null },
    })

    const res = await ctx.client.request<any>(gql`
      {
        organization(slug: "test") {
          slug
        }
      }
    `)

    expect(res.organization).toEqual({ slug: "test" })
  })

  it("does not return hidden organizations without the hidden flag", async () => {
    await ctx.prisma.organization.update({
      where: { slug: "test" },
      data: { hidden: true },
    })

    const res = await ctx.client.request<any>(gql`
      {
        organization(slug: "test") {
          slug
        }
      }
    `)

    expect(res.organization).toBeNull()
  })

  it("lets admins read verified users", async () => {
    await ctx.prisma.verifiedUser.create({
      data: {
        personal_unique_code: "puc",
        display_name: "Verified",
        organization: { connect: { slug: "test" } },
        user: { connect: { id: "20000000000000000000000000000102" } },
      },
    })

    const res = await ctx.client.request<any>(
      gql`
        {
          organizations {
            slug
            verified_users {
              display_name
            }
          }
        }
      `,
      {},
      FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
    )

    expect(
      res.organizations.find((o: any) => o.slug === "test").verified_users,
    ).toEqual([{ display_name: "Verified" }])
  })
})

describe("join_organization_email_template", () => {
  setupTMCWithDefaultFakeUsers()

  const joinEmailTemplateQuery = gql`
    {
      organization(slug: "test") {
        join_organization_email_template {
          title
        }
      }
    }
  `

  beforeEach(async () => {
    await seed(ctx.prisma)
  })

  it("refuses anonymous callers", async () => {
    await expect(ctx.client.request(joinEmailTemplateQuery)).rejects.toThrow(
      /Not authorized/,
    )
  })

  it("lets admins read it", async () => {
    const res = await ctx.client.request<any>(
      joinEmailTemplateQuery,
      {},
      FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
    )

    expect(res.organization.join_organization_email_template).toEqual({
      title: "organization join email",
    })
  })
})

describe("addVerifiedUser", () => {
  setupTMCWithDefaultFakeUsers()

  const addVerifiedUserMutation = gql`
    mutation AddVerifiedUser($organization_id: ID!, $secret: String!) {
      addVerifiedUser(
        verified_user: {
          personal_unique_code: "puc"
          organization_id: $organization_id
          organization_secret: $secret
        }
      ) {
        personal_unique_code
      }
    }
  `

  const addVerifiedUser = (secret: string) =>
    ctx.client.request<any>(
      addVerifiedUserMutation,
      { organization_id: "10000000000000000000000000000102", secret },
      FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
    )

  beforeEach(async () => {
    await seed(ctx.prisma)
  })

  it("accepts the organization's secret", async () => {
    const res = await addVerifiedUser("kissa")

    expect(res.addVerifiedUser).toEqual({ personal_unique_code: "puc" })
  })

  it("refuses a wrong secret", async () => {
    await expect(addVerifiedUser("koira")).rejects.toThrow(
      /wrong organization secret key/,
    )
  })

  it("refuses a disabled organization's secret", async () => {
    await ctx.prisma.organization.update({
      where: { id: "10000000000000000000000000000102" },
      data: { disabled: true },
    })

    await expect(addVerifiedUser("kissa")).rejects.toThrow(
      /wrong organization secret key/,
    )
  })
})
