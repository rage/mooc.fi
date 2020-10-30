import { gql } from "graphql-request"
import { getTestContext } from "./__helpers"
import TmcClient from "../services/tmc"
import { UserInfo } from "/domain/UserInfo"

const ctx = getTestContext()

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
/*describe("user queries", () => {
  it("shows current user", async () => {
    const res = await ctx.client.request(`
      query {
        currentUser {
          id
        }
      }
    `)

    expect(res).toMatchSnapshot()
  })
})*/

describe("user mutations", () => {
  describe("addUser", () => {
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
        data: {
          upstream_id: 1,
          administrator: false,
          email: "e@mail.com",
          first_name: "first",
          last_name: "last",
          username: "user",
        },
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

  describe("updateResearchConsent", () => {
    beforeEach(async () => {
      await ctx.prisma.user.create({
        data: {
          upstream_id: 1,
          administrator: false,
          email: "e@mail.com",
          first_name: "first",
          last_name: "last",
          username: "user",
          research_consent: false,
        },
      })

      const userDetails: UserInfo = {
        id: 1,
        administrator: false,
        email: "e@mail.com",
        user_field: {
          first_name: "first",
          last_name: "last",
          course_announcements: false,
          html1: "",
          organizational_id: "",
        },
        username: "user",
        extra_fields: {},
      }

      jest
        .spyOn(TmcClient.prototype, "getCurrentUserDetails")
        .mockImplementation(async () => userDetails)

      ctx.client.setHeader("Authorization", "Bearer 12345")
    })

    afterEach(async () => {
      await ctx.prisma.user.delete({ where: { upstream_id: 1 } })
      jest.restoreAllMocks()
    })

    it("updates correctly", async () => {
      const res = await ctx.client.request(updateReseachConsentMutation, {
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
    })

    it("won't update research consent without auth", async () => {
      ctx.client.setHeader("Authorization", "")

      await expect(async () => {
        await ctx.client.request(updateReseachConsentMutation, { value: true })
      }).rejects.toThrow()
    })
  })
})
