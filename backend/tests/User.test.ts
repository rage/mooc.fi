import { gql } from "graphql-request"
import { getTestContext } from "./__helpers"
import { adminUserDetails, normalUser, normalUserDetails } from "./data"
import nock from "nock"

const addUserMutation = gql`
  mutation AddUser($user: UserArg!) {
    addUser(user: $user) {
      id
      email
      first_name
      last_name
      username
      research_consent
      upstream_id
      administrator
    }
  }
`

const updateReseachConsentMutation = gql`
  mutation UpdateResearchConsent($value: Boolean!) {
    updateResearchConsent(value: $value) {
      id
    }
  }
`

const ctx = getTestContext()

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

describe("user queries", () => {
  describe("currentUser", () => {
    beforeEach(async () => {
      await ctx.prisma.user.create({
        data: normalUser,
      })
    })

    it("shows current user when logged in", async () => {
      ctx!.client.setHeader("Authorization", "Bearer normal")

      const res = await ctx.client.request(`
      query {
        currentUser {
          id
          administrator
          email
          first_name
          last_name
          username
          upstream_id
        }
      }
    `)

      expect(res).toMatchInlineSnapshot(
        {
          currentUser: {
            id: expect.any(String),
            administrator: false,
            email: "e@mail.com",
            first_name: "first",
            last_name: "last",
            username: "user",
            upstream_id: 1,
          },
        },
        `
              Object {
                "currentUser": Object {
                  "administrator": false,
                  "email": "e@mail.com",
                  "first_name": "first",
                  "id": Any<String>,
                  "last_name": "last",
                  "upstream_id": 1,
                  "username": "user",
                },
              }
          `,
      )

      jest.clearAllMocks()
    })

    it("shows null when not logged in", async () => {
      ctx!.client.setHeader("Authorization", "")

      const res = await ctx.client.request(`
      query {
        currentUser {
          id
          administrator
          email
          first_name
          last_name
          username
          upstream_id
        }
      }
    `)

      expect(res).toMatchInlineSnapshot(
        {
          currentUser: null,
        },
        `
        Object {
          "currentUser": null,
        }
      `,
      )
    })
  })
})

describe("user mutations", () => {
  beforeEach(async () => {
    await ctx.prisma.user.deleteMany({ where: {} })
  })

  describe("addUser", () => {
    beforeAll(() => ctx!.client.setHeader("Authorization", ""))

    it("creates user correctly", async () => {
      const res = await ctx.client.request(addUserMutation, {
        user: {
          email: "e@mail.com",
          first_name: "first",
          last_name: "last",
          username: "username",
          research_consent: false,
          upstream_id: 1,
        },
      })

      expect(res).toMatchSnapshot({
        addUser: {
          id: expect.any(String),
        },
      })
    })

    it("won't create user with same id", async () => {
      await ctx.prisma.user.create({
        data: normalUser,
      })

      await expect(async () => {
        await ctx.client.request(addUserMutation, {
          user: {
            email: "e@mail.com",
            first_name: "first",
            last_name: "last",
            username: "username",
            research_consent: false,
            upstream_id: 1,
          },
        })
      }).rejects.toThrow()
    })
  })

  describe.skip("updateResearchConsent", () => {
    beforeEach(async () => {
      await ctx!.prisma.user.create({
        data: normalUser,
      })
    })

    afterEach(async () => {
      await ctx!.prisma.user.delete({ where: { upstream_id: 1 } })
      ctx.user = undefined
    })

    it("updates correctly", async () => {
      ctx!.client.setHeader("Authorization", "Bearer normal")

      const res = await ctx!.client.request(updateReseachConsentMutation, {
        value: true,
      })

      expect(res.updateResearchConsent).toMatchInlineSnapshot(
        { id: expect.any(String) },
        `
        Object {
          "id": Any<String>,
        }
      `,
      )
      const updatedConsent = await ctx!.prisma.user.findFirst({
        where: { upstream_id: 1 },
        select: { research_consent: true },
      })

      expect(updatedConsent).toMatchObject({ research_consent: true })
    })

    it("won't update research consent without auth", async () => {
      ctx!.client.setHeader("Authorization", "")

      try {
        await ctx!.client.request(updateReseachConsentMutation, { value: true })
        fail()
      } catch {}
    })
  })
})
