import { createTestContext } from "./__helpers"

const ctx = createTestContext()

describe("user queries", () => {
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
})

/*describe("user mutations", () => {
  it("creates user correctly", async () => {
    const res = await ctx.client.request(`
      mutation {
        addUser(
          user: {
            email: "e@mail.com",
            first_name: "first",
            last_name: "last",
            username: "username",
            research_consent: false,
            upstream_id: 1
          }
        ) {
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
    `)

    expect(res).toMatchSnapshot()
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
      await ctx.client.request(`
        mutation {
          addUser(
            user: {
              email: "e@mail.com",
              first_name: "first",
              last_name: "last",
              username: "username",
              research_consent: false,
              upstream_id: 1
            }
          ) {
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
      `)
    }).rejects.toThrow()
  })
})*/
