import { gql } from "graphql-request"

import {
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  setupTMCWithDefaultFakeUsers,
} from "../../tests"
import { normalUser } from "../../tests/data"

const ctx = getTestContext()

const currentUserQuery = gql`
  query {
    currentUser {
      upstream_id
      username
    }
  }
`

const STALE_TIMESTAMP = new Date("2000-01-01T00:00:00Z")

describe("moocfiAuthPlugin", () => {
  setupTMCWithDefaultFakeUsers()

  it("creates the user on first sight", async () => {
    const res = await ctx.client.request<{
      currentUser: { upstream_id: number; username: string }
    }>(currentUserQuery, {}, FAKE_NORMAL_USER_AUTHORIZATION_HEADERS)

    expect(res.currentUser).toEqual({ upstream_id: 1, username: "user" })
    expect(await ctx.prisma.user.count({ where: { upstream_id: 1 } })).toBe(1)
  })

  it("doesn't write a user whose details are unchanged", async () => {
    await ctx.prisma.user.create({
      data: { ...normalUser, updated_at: STALE_TIMESTAMP },
    })

    await ctx.client.request(
      currentUserQuery,
      {},
      FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
    )

    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { upstream_id: 1 },
    })
    expect(user.updated_at).toEqual(STALE_TIMESTAMP)
  })

  it("updates a user whose details changed", async () => {
    await ctx.prisma.user.create({
      data: {
        ...normalUser,
        email: "old@mail.com",
        updated_at: STALE_TIMESTAMP,
      },
    })

    await ctx.client.request(
      currentUserQuery,
      {},
      FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
    )

    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { upstream_id: 1 },
    })
    expect(user.email).toBe("e@mail.com")
    expect(user.updated_at).not.toEqual(STALE_TIMESTAMP)
  })
})
