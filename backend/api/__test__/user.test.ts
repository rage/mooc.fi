import { ApiContext } from "../../auth"
import {
  createRequestHelpers,
  getTestContext,
  RequestPost,
} from "../../tests/__helpers"
import { seed } from "../../tests/data/seed"

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
  describe("/user/update-from-tmc", () => {
    let postUpdateUserFromTMC: RequestPost
    beforeEach(async () => {
      process.env.TMC_UPDATE_SECRET = "secret"
      await seed(ctx.prisma)
      const { post } = createRequestHelpers(ctx.port)
      postUpdateUserFromTMC = post("/api/user/update-from-tmc", {})
    })

    it("errors on auth error", async () => {
      try {
        await postUpdateUserFromTMC({
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
        await postUpdateUserFromTMC({
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

    it("errors on no upstream_id", async () => {
      try {
        await postUpdateUserFromTMC({
          data: { secret: "secret" },
          headers: { authorization: "Bearer normal" },
        })

        fail()
      } catch (err: any) {
        const { response } = err
        expect(response.status).toBe(400)
        expect(response.data.success).toBe(false)
        expect(response.data.message).toBe("No upstream_id provided")
      }
    })

    it("updates upstream_id", async () => {
      const before = await ctx.prisma.user.findUnique({
        where: {
          id: "20000000000000000000000000000102",
        },
      })
      expect(before?.upstream_id).toBe(1)

      const res = await postUpdateUserFromTMC({
        data: { upstream_id: 666, secret: "secret" },
        headers: { authorization: "Bearer normal" },
      })

      expect(res.status).toBe(200)
      expect(res.data.message).toBe("User upstream_id updated")
      expect(res.data.upstream_id).toBe(666)

      const after = await ctx.prisma.user.findUnique({
        where: {
          id: "20000000000000000000000000000102",
        },
      })
      expect(after?.upstream_id).toBe(666)
    })

    it("returns 500 on update error", async () => {
      const spy = jest.spyOn(ctx.prisma.user, "update")
      // @ts-ignore: never mind the return type
      spy.mockImplementation(async () => {
        throw new Error("Mocked prisma error")
      })
      try {
        await postUpdateUserFromTMC({
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
          personal_unique_code: "personal:unique:code:university.fi:admin",
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
          personal_unique_code: "personal:unique:code:university.fi:admin",
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
          personal_unique_code:
            "personal:unique:code:second-university.fi:third",
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
