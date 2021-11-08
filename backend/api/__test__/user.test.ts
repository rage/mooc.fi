import { ApiContext } from "../../auth"
import { createRequestHelpers, getTestContext, RequestPost } from "../../tests"
import { seed } from "../../tests/data"

const ctx = getTestContext()

jest.mock("../../util/validateAuth", () => ({
  __esModule: true,
  requireAuth: async (auth: string, _ctx: ApiContext) => {
    const ret: Record<string, object> = {
      "Bearer normal": { id: "20000000000000000000000000000102" },
      "Bearer admin": { id: "20000000000000000000000000000103" },
      "Bearer third": { id: "20000000000000000000000000000104" },
      "Bearer old": { error: "Token is no longer valid" },
      "Bearer invalid": { error: "Some JWT error" },
    }

    return new Promise((resolve) =>
      resolve(ret[auth ?? ""] ?? { error: "Missing token" }),
    )
  },
}))

describe("API", () => {
  describe("/user PATCH", () => {
    let patchUpdateUser: RequestPost
    beforeEach(async () => {
      process.env.UPDATE_USER_SECRET = "secret"
      await seed(ctx.prisma)
      const { patch } = createRequestHelpers(ctx.port)
      patchUpdateUser = patch("/api/user", {})
    })

    it("errors on auth error", async () => {
      try {
        await patchUpdateUser({
          data: { upstream_id: 1, secret: "secret" },
        })

        fail()
      } catch (err: any) {
        const { response } = err
        expect(response.status).toBe(403)
        expect(response.data.success).toBe(false)
        expect(response.data.message).toBe("Not logged in.")
      }
    })

    it("errors on invalid secret", async () => {
      try {
        await patchUpdateUser({
          data: { upstream_id: 1, secret: "foo" },
          headers: { authorization: "Bearer normal" },
        })

        fail()
      } catch (err: any) {
        const { response } = err
        expect(response.status).toBe(405)
        expect(response.data.success).toBe(false)
        expect(response.data.message).toBe("Not allowed")
      }
    })

    it("errors on no fields to update", async () => {
      try {
        await patchUpdateUser({
          data: { secret: "secret" },
          headers: { authorization: "Bearer normal" },
        })

        fail()
      } catch (err: any) {
        const { response } = err
        expect(response.status).toBe(400)
        expect(response.data.success).toBe(false)
        expect(response.data.message).toBe("No data provided")
      }
    })

    it("updates user", async () => {
      const before = await ctx.prisma.user.findUnique({
        where: {
          id: "20000000000000000000000000000102",
        },
      })
      expect(before?.upstream_id).toBe(1)

      const res = await patchUpdateUser({
        data: { upstream_id: 666, secret: "secret" },
        headers: { authorization: "Bearer normal" },
      })

      expect(res.status).toBe(200)
      expect(res.data.message).toBe("User updated")
      expect(res.data.data.upstream_id).toBe(666)

      const after = await ctx.prisma.user.findUnique({
        where: {
          id: "20000000000000000000000000000102",
        },
      })
      expect(after?.upstream_id).toBe(666)
    })

    it("ignores not updateable fields", async () => {
      const before = await ctx.prisma.user.findUnique({
        where: {
          id: "20000000000000000000000000000102",
        },
      })

      const res = await patchUpdateUser({
        data: {
          created_at: "2100-01-01T10:00:00.00+02:00",
          upstream_id: 666,
          last_name: "kissa",
          secret: "secret",
        },
        headers: { authorization: "Bearer normal" },
      })

      expect(res.status).toBe(200)
      expect(res.data.message).toBe("User updated")
      expect(res.data.data.upstream_id).toBe(666)
      expect(res.data.data.last_name).toBe("kissa")
      expect(res.data.data.created_at).toEqual(
        before?.created_at?.toISOString(),
      )
    })

    it("returns 500 on update error", async () => {
      const spy = jest.spyOn(ctx.prisma.user, "update")
      // @ts-ignore: never mind the return type
      spy.mockImplementation(async () => {
        throw new Error("Mocked prisma error")
      })
      try {
        await patchUpdateUser({
          data: { secret: "secret", upstream_id: 666 },
          headers: { authorization: "Bearer normal" },
        })
        fail()
      } catch (err: any) {
        const { response } = err
        expect(response.status).toBe(500)
        expect(response.data.success).toBe(false)
        expect(response.data.message).toBe("User update not successful")
      } finally {
        jest.clearAllMocks()
      }
    })
  })

  describe("/user/update-person-affiliation", () => {
    let postUpdatePersonAffiliation: RequestPost
    beforeEach(async () => {
      await seed(ctx.prisma)
      const { post } = createRequestHelpers(ctx.port)
      postUpdatePersonAffiliation = post(
        "/api/user/update-person-affiliation",
        {},
      )
    })

    it("errors on auth error", async () => {
      try {
        await postUpdatePersonAffiliation({
          data: {
            person_affiliation: "member",
            personal_unique_code: "personal:unique:code:university.fi:admin",
            home_organization: "university.fi",
          },
        })

        fail()
      } catch (err: any) {
        const { response } = err
        expect(response.status).toBe(403)
        expect(response.data.success).toBe(false)
        expect(response.data.message).toBe("Not logged in.")
      }
    })

    it("errors on missing parameters", async () => {
      const testData = [
        {
          person_affiliation: "member",
          home_organization: "university.fi",
        },
        {
          person_affiliation: "member",
          personal_unique_code: "personal:unique:code:university.fi:admin",
        },
      ]

      for (const data of testData) {
        try {
          await postUpdatePersonAffiliation({
            data,
            headers: {
              authorization: "Bearer admin",
            },
          })
          fail()
        } catch (err: any) {
          const { response } = err
          expect(response.status).toBe(400)
          expect(response.data.success).toBe(false)
        }
      }
    })

    it("doesn't change if same as existing", async () => {
      const before = await ctx.prisma.verifiedUser.findUnique({
        where: {
          id: "65400000000000000000000000000001",
        },
      })

      const res = await postUpdatePersonAffiliation({
        data: {
          person_affiliation: "member;student;staff",
          edu_person_principal_name: "admin@university.fi",
          home_organization: "university.fi",
        },
        headers: { authorization: "Bearer admin" },
      })

      expect(res.status).toBe(200)
      expect(res.data.success).toBe(true)
      expect(res.data.message).toBe("No change")

      const after = await ctx.prisma.verifiedUser.findUnique({
        where: {
          id: "65400000000000000000000000000001",
        },
      })

      expect(before?.updated_at).toEqual(after?.updated_at)
      expect(before?.person_affiliation).toEqual(after?.person_affiliation)
      expect(before?.person_affiliation_updated_at).toEqual(
        after?.person_affiliation_updated_at,
      )
    })

    it("updates value and date", async () => {
      const before = await ctx.prisma.verifiedUser.findUnique({
        where: {
          id: "65400000000000000000000000000001",
        },
      })

      const res = await postUpdatePersonAffiliation({
        data: {
          person_affiliation: "member;student;staff;wizard",
          edu_person_principal_name: "admin@university.fi",
          home_organization: "university.fi",
        },
        headers: { authorization: "Bearer admin" },
      })

      expect(res.status).toBe(200)
      expect(res.data.success).toBe(true)
      expect(res.data.message).toBe("Person affiliation updated")

      const after = await ctx.prisma.verifiedUser.findUnique({
        where: {
          id: "65400000000000000000000000000001",
        },
      })

      expect(before?.person_affiliation).not.toEqual(after?.person_affiliation)
      expect(
        before?.person_affiliation_updated_at! <
          after?.person_affiliation_updated_at!,
      ).toBeTruthy()
    })

    it("updates correct entry when user has multiple organizations", async () => {
      const beforeFirst = await ctx.prisma.verifiedUser.findUnique({
        where: {
          id: "65400000000000000000000000000002",
        },
      })
      const beforeSecond = await ctx.prisma.verifiedUser.findUnique({
        where: {
          id: "65400000000000000000000000000003",
        },
      })

      const res = await postUpdatePersonAffiliation({
        data: {
          person_affiliation: "member;student;wizard",
          edu_person_principal_name: "third@second-university.fi",
          home_organization: "second-university.fi",
        },
        headers: { authorization: "Bearer third" },
      })

      expect(res.status).toBe(200)
      expect(res.data.success).toBe(true)
      expect(res.data.message).toBe("Person affiliation updated")

      const afterFirst = await ctx.prisma.verifiedUser.findUnique({
        where: {
          id: "65400000000000000000000000000002",
        },
      })
      const afterSecond = await ctx.prisma.verifiedUser.findUnique({
        where: {
          id: "65400000000000000000000000000003",
        },
      })

      expect(beforeFirst).toEqual(afterFirst)
      expect(beforeSecond?.person_affiliation).not.toEqual(
        afterSecond?.person_affiliation,
      )
      expect(
        beforeSecond?.person_affiliation_updated_at! <
          afterSecond?.person_affiliation_updated_at!,
      ).toBeTruthy()
    })
  })
})
