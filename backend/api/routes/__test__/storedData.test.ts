import {
  createRequestHelpers,
  fakeTMCCurrent,
  getTestContext,
  RequestGet,
  RequestPost,
} from "../../../tests"
import { normalUserDetails, seed } from "../../../tests/data"

const ctx = getTestContext()

describe("API", () => {
  describe("/api/temporary-stored-data", () => {
    const tmc = fakeTMCCurrent({
      "Bearer normal": [200, normalUserDetails],
      "Bearer third": [200, { ...normalUserDetails, id: 3 }],
    })

    beforeAll(() => tmc.setup())
    afterAll(() => tmc.teardown())

    let getStoredData: (slug: string) => RequestGet
    let postStoredData: (slug: string) => RequestPost

    beforeEach(async () => {
      await seed(ctx.prisma)
      const { get, post } = createRequestHelpers(ctx.port)
      getStoredData = (slug: string) =>
        get(`/api/temporary-stored-data/${slug}`, {})
      postStoredData = (slug: string) =>
        post(`/api/temporary-stored-data/${slug}`, {})
    })

    describe("post", () => {
      it("errors on no auth", async () => {
        return postStoredData("course1")({
          data: { data: "foo" },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(401)
          })
      })

      it("errors on no data", async () => {
        return postStoredData("course1")({
          headers: { Authorization: "Bearer normal" },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(400)
          })
      })

      it("errors on invalid slug", async () => {
        return postStoredData("foobarbaz")({
          headers: { Authorization: "Bearer normal" },
          data: { data: "foo" },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(401)
            expect(response.data.error).toContain(
              "course with slug or course alias with course code foobarbaz",
            )
          })
      })

      it("creates stored data", async () => {
        const existing = await ctx.prisma.storedData.findFirst({
          where: {
            user_id: "20000000000000000000000000000102",
            course_id: "00000000000000000000000000000002",
          },
        })

        expect(existing).toBeNull()

        const res = await postStoredData("course1")({
          data: { data: "foo foo" },
          headers: { Authorization: "Bearer normal" },
        })

        expect(res.status).toBe(200)
        expect(res.data.message).toContain("stored data created")

        const created = await ctx.prisma.storedData.findFirst({
          where: {
            user_id: "20000000000000000000000000000102",
            course_id: "00000000000000000000000000000002",
          },
        })

        expect(created?.data).toEqual("foo foo")
      })

      it("updates stored data", async () => {
        const existing = await ctx.prisma.storedData.findFirst({
          where: {
            user_id: "20000000000000000000000000000102",
            course_id: "00000000000000000000000000000001",
          },
        })

        expect(existing?.data).toEqual("user1_foo")

        const res = await postStoredData("course2")({
          data: { data: "foo foo" },
          headers: { Authorization: "Bearer normal" },
        })

        expect(res.status).toBe(200)
        expect(res.data.message).toEqual("stored data updated")

        const updated = await ctx.prisma.storedData.findFirst({
          where: {
            user_id: "20000000000000000000000000000102",
            course_id: "00000000000000000000000000000001",
          },
        })

        expect(updated?.data).toEqual("foo foo")
      })
    })

    describe("get", () => {
      it("errors on no auth", async () => {
        return getStoredData("course1")({})
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(401)
          })
      })

      it("errors on invalid slug", async () => {
        return getStoredData("foobarbaz")({
          headers: { Authorization: "Bearer normal" },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(401)
            expect(response.data.error).toContain("course with slug foobarbaz")
          })
      })

      it("errors on non-owned course", async () => {
        return getStoredData("course1")({
          headers: { Authorization: "Bearer normal" },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(401)
            expect(response.data.message).toContain("no ownership")
          })
      })

      it("returns stored data from owned course", async () => {
        const res = await getStoredData("course2")({
          headers: { Authorization: "Bearer normal" },
        })

        expect(res.data).toMatchSnapshot()
      })
    })
  })
})
