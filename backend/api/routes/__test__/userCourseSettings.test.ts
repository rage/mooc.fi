import { omit } from "lodash"

import {
  createRequestHelpers,
  FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  RequestGet,
  RequestPost,
  setupTMCWithDefaultFakeUsers,
} from "../../../tests"
import { seed } from "../../../tests/data"

const ctx = getTestContext()

describe("API", () => {
  describe("/api/user-course-settings", () => {
    setupTMCWithDefaultFakeUsers()

    describe("GET", () => {
      let getSettings: (slug: string) => RequestGet

      beforeEach(async () => {
        await seed(ctx.prisma)
        const { get } = createRequestHelpers(ctx.port)
        getSettings = (slug: string) =>
          get(`/api/user-course-settings/${slug}`, {})
      })

      it("errors without slug", async () => {
        return getSettings("")({})
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(400)
          })
      })

      it("errors without auth", async () => {
        return getSettings("course1")({})
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(401)
          })
      })

      it("errors on non-existent course", async () => {
        return getSettings("foobar")({
          headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(404)
          })
      })

      it("returns null with user with no settings", async () => {
        return getSettings("course1")({
          headers: FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
        }).then((res) => {
          expect(res.data).toBeNull()
        })
      })

      it("returns null with course with no settings", async () => {
        return getSettings("handler")({
          headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        }).then((res) => {
          expect(res.data).toBeNull()
        })
      })

      it("warns on key clashes", async () => {
        return getSettings("course2")({
          headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        }).then(async (_) => {
          // @ts-ignore: mock
          expect(ctx.logger.warn.mock.calls.length).toBeGreaterThan(0)
          // @ts-ignore: mock
          expect(ctx.logger.warn.mock.calls[0][0]).toContain("country")
          // @ts-ignore: mock
          expect(ctx.logger.warn.mock.calls[0][0]).toContain("research")
        })
      })

      it("returns settings correctly", async () => {
        return getSettings("course1")({
          headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        }).then(async (res) => {
          const settings = await ctx.prisma.userCourseSetting.findFirst({
            where: {
              id: "40000000-0000-0000-0000-000000000102",
            },
          })
          const expected = {
            ...omit(settings, "other"),
            ...((settings?.other as object) ?? {}),
          }

          expect(res.data).toEqual(JSON.parse(JSON.stringify(expected)))
        })
      })

      it("returns inherited settings correctly", async () => {
        return getSettings("inherits")({
          headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        }).then(async (res) => {
          const settings = await ctx.prisma.userCourseSetting.findFirst({
            where: {
              id: "40000000-0000-0000-0000-000000000105",
            },
          })
          const expected = {
            ...omit(settings, "other"),
            ...((settings?.other as object) ?? {}),
          }

          expect(res.data).toEqual(JSON.parse(JSON.stringify(expected)))
        })
      })
    })

    describe("POST", () => {
      let postSettings: (slug: string) => RequestPost
      beforeEach(async () => {
        await seed(ctx.prisma)
        const { post } = createRequestHelpers(ctx.port)
        postSettings = (slug: string) =>
          post(`/api/user-course-settings/${slug}`, {})
      })

      it("errors without slug", async () => {
        return postSettings("")({
          data: { foo: 1 },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(400)
          })
      })

      it("errors without auth", async () => {
        return postSettings("course1")({
          data: { foo: 1 },
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.status).toBe(401)
          })
      })

      it("errors on non-existing course", async () => {
        return postSettings("foooo")({
          data: { foo: 1 },
          headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.data.message).toContain("course not found")
            expect(response.status).toBe(404)
          })
      })

      it("errors without given values", async () => {
        return postSettings("course1")({
          data: {},
          headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        })
          .then(() => fail())
          .catch(({ response }) => {
            expect(response.data.message).toContain("must provide")
            expect(response.status).toBe(400)
          })
      })

      it("creates new setting when no existing found", async () => {
        const res = await postSettings("handler")({
          data: {
            id: "bogus",
            language: "fi",
            country: "en",
            marketing: true,
            isCat: true,
            sound: "meow",
          },
          headers: FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        })

        expect(res.data.message).toContain("settings created")
        expect(res.status).toBe(200)

        const createdSetting = await ctx.prisma.userCourseSetting.findFirst({
          where: {
            user_id: "20000000-0000-0000-0000-000000000102",
            course_id: "00000000-0000-0000-0000-000000000666",
          },
        })

        expect(createdSetting).not.toBeNull()
        expect(createdSetting?.id).not.toEqual("bogus")
        expect(createdSetting?.language).toEqual("fi")
        expect(createdSetting?.country).toEqual("en")
        expect(createdSetting?.marketing).toEqual(true)
        expect(createdSetting?.other).toEqual({
          isCat: true,
          sound: "meow",
        })
      })

      it("updates correctly, filters unwanted fields and shoves other fields to other, updating existing ones", async () => {
        const existingSetting = await ctx.prisma.userCourseSetting.findFirst({
          where: {
            id: "40000000-0000-0000-0000-000000000102",
          },
        })

        if (!existingSetting) {
          fail()
        }
        const res = await postSettings("course1")({
          data: {
            id: "bogus",
            language: "fi",
            country: "en",
            marketing: true,
            isCat: true,
            sound: "meow",
          },
          headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        })

        expect(res.data.message).toContain("settings updated")
        expect(res.status).toBe(200)

        const updatedSetting = await ctx.prisma.userCourseSetting.findFirst({
          where: {
            id: "40000000-0000-0000-0000-000000000102",
          },
        })

        if (!updatedSetting) {
          fail()
        }

        expect(
          (updatedSetting.updated_at ?? new Date(0)) >
            (existingSetting.updated_at ?? new Date(0)),
        ).toBe(true)
        expect(updatedSetting.language).toBe("fi")
        expect(updatedSetting.country).toBe("en")
        expect(updatedSetting.marketing).toBe(true)
        expect(updatedSetting.other).toEqual({
          hasWings: true,
          isCat: true,
          sound: "meow",
        })
      })

      it("updates correctly when settings inherited", async () => {
        const existingSetting = await ctx.prisma.userCourseSetting.findFirst({
          where: {
            id: "40000000-0000-0000-0000-000000000105",
          },
        })
        if (!existingSetting) {
          fail()
        }

        const res = await postSettings("inherits")({
          data: {
            id: "bogus",
            language: "fi",
            country: "en",
            marketing: true,
            isCat: true,
            sound: "meow",
          },
          headers: FAKE_ADMIN_USER_AUTHORIZATION_HEADERS,
        })
        expect(res.data.message).toContain("settings updated")
        expect(res.status).toBe(200)

        const updatedSetting = await ctx.prisma.userCourseSetting.findFirst({
          where: {
            id: "40000000-0000-0000-0000-000000000105",
          },
        })
        if (!updatedSetting) {
          fail()
        }

        expect(
          (updatedSetting.updated_at ?? new Date(0)) >
            (existingSetting.updated_at ?? new Date(0)),
        ).toBe(true)
        expect(updatedSetting.language).toBe("fi")
        expect(updatedSetting.country).toBe("en")
        expect(updatedSetting.marketing).toBe(true)
        expect(updatedSetting.other).toEqual({
          hasWings: true,
          isCat: true,
          sound: "meow",
        })
      })
    })
  })
})
