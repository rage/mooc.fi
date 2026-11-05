import nock from "nock"

import {
  createRequestHelpers,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  RequestPost,
  setupTMCWithDefaultFakeUsers,
} from "../../../tests"
import { seed } from "../../../tests/data"

const COURSES_BASE_URL = "http://courses.test"
const MINT_PATH = "/api/v0/moocfi/credit-registration-handoffs"

jest.mock("../../../config", () => ({
  ...jest.requireActual("../../../config"),
  COURSES_BASE_URL: "http://courses.test",
}))

const config = jest.requireMock("../../../config")

const ctx = getTestContext()

const HANDLER_COURSE_ID = "00000000-0000-0000-0000-000000000666"
const CUTOFF = "2026-10-01T09:30:00.123Z"

describe("API", () => {
  describe("/api/credit-registration-handoff", () => {
    setupTMCWithDefaultFakeUsers()

    let postHandoff: (slug: string) => RequestPost

    beforeEach(async () => {
      await seed(ctx.prisma)
      await ctx.prisma.course.update({
        where: { id: HANDLER_COURSE_ID },
        data: { credit_registration_delegated_at: new Date(CUTOFF) },
      })
      config.COURSES_HANDOFF_SECRET = "handoff-secret"
      const { post } = createRequestHelpers(ctx.port)
      postHandoff = (slug) =>
        post(
          `/api/credit-registration-handoff/${slug}`,
          FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        )
    })

    it("mints a handoff on the handler course and returns its URL", async () => {
      let mintBody: any
      const mint = nock(COURSES_BASE_URL)
        .post(MINT_PATH, (body) => {
          mintBody = body
          return true
        })
        .matchHeader("authorization", "Bearer handoff-secret")
        .reply(201, { redirect_url: "http://courses.test/redeem?token=t" })

      const res = await postHandoff("handled")({ data: { ui_language: "fi" } })

      expect(res.status).toBe(200)
      expect(res.data).toEqual({
        redirect_url: "http://courses.test/redeem?token=t",
      })
      expect(mint.isDone()).toBe(true)
      expect(mintBody).toEqual({
        tmc_access_token: "normal",
        moocfi_course_id: HANDLER_COURSE_ID,
        delegated_at: CUTOFF,
        client_ip: expect.any(String),
        ui_language: "fi",
      })
    })

    it("sends courses.mooc.fi English for any language it does not have", async () => {
      let uiLanguage: string | undefined
      nock(COURSES_BASE_URL)
        .post(MINT_PATH, (body) => {
          uiLanguage = body.ui_language
          return true
        })
        .reply(201, { redirect_url: "http://courses.test/redeem?token=t" })

      await postHandoff("handled")({ data: { ui_language: "de" } })

      expect(uiLanguage).toBe("en")
    })

    it("takes the client IP from X-Forwarded-For set by the proxy", async () => {
      let clientIp: string | undefined
      nock(COURSES_BASE_URL)
        .post(MINT_PATH, (body) => {
          clientIp = body.client_ip
          return true
        })
        .reply(201, { redirect_url: "http://courses.test/redeem?token=t" })

      await postHandoff("handled")({
        headers: {
          ...FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
          "X-Forwarded-For": "198.51.100.1, 203.0.113.7",
        },
      })

      expect(clientIp).toBe("203.0.113.7")
    })

    it("errors on no auth", async () => {
      return postHandoff("handled")({ headers: {} })
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
        })
    })

    it("errors on a course that is not delegated", async () => {
      return postHandoff("course1")({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(404)
        })
    })

    it("answers 502 with courses.mooc.fi's refusal type", async () => {
      nock(COURSES_BASE_URL)
        .post(MINT_PATH)
        .reply(409, { type: "cutoff_mismatch", message: "Not set up." })

      return postHandoff("handled")({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(502)
          expect(response.data).toEqual({
            type: "cutoff_mismatch",
            message: "Could not open courses.mooc.fi",
          })
        })
    })

    it("refuses a redirect_url outside courses.mooc.fi", async () => {
      nock(COURSES_BASE_URL)
        .post(MINT_PATH)
        .reply(201, { redirect_url: "javascript:alert(1)//courses.test" })

      return postHandoff("handled")({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(502)
          expect(response.data.type).toBe("unavailable")
        })
    })

    it("answers 401 when TMC rejected the student's session", async () => {
      nock(COURSES_BASE_URL)
        .post(MINT_PATH)
        .reply(401, { type: "tmc_rejected" })

      return postHandoff("handled")({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(401)
          expect(response.data.type).toBe("tmc_rejected")
        })
    })

    it("passes rate limiting on with its retry time", async () => {
      nock(COURSES_BASE_URL)
        .post(MINT_PATH)
        .reply(429, { type: "rate_limited" }, { "Retry-After": "30" })

      return postHandoff("handled")({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(429)
          expect(response.headers["retry-after"]).toBe("30")
          expect(response.data).toEqual({ type: "rate_limited" })
        })
    })

    it("does not follow a redirect from courses.mooc.fi", async () => {
      nock(COURSES_BASE_URL)
        .post(MINT_PATH)
        .reply(307, {}, { Location: "http://elsewhere.test/mint" })
      const toElsewhere = nock("http://elsewhere.test").post("/mint")
      const elsewhere = toElsewhere.reply(201)

      await postHandoff("handled")({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(502)
        })
      expect(elsewhere.isDone()).toBe(false)
      nock.removeInterceptor(toElsewhere)
    })

    it("limits each student, before asking courses.mooc.fi", async () => {
      const mint = nock(COURSES_BASE_URL)
        .post(MINT_PATH)
        .times(10)
        .reply(201, { redirect_url: "http://courses.test/redeem?token=t" })
      const mintAsThird = (ip: string) =>
        postHandoff("handled")({
          headers: {
            ...FAKE_THIRD_USER_AUTHORIZATION_HEADERS,
            "X-Forwarded-For": ip,
          },
        })
          .then((res) => res.status)
          .catch(({ response }) => response.status)

      for (let i = 0; i < 10; i++) {
        expect(await mintAsThird(`192.0.2.${i}`)).toBe(200)
      }
      expect(mint.isDone()).toBe(true)

      const mintOverLimit = nock(COURSES_BASE_URL).post(MINT_PATH)
      const overLimit = mintOverLimit.reply(201)
      expect(await mintAsThird("192.0.2.100")).toBe(429)
      expect(overLimit.isDone()).toBe(false)
      nock.removeInterceptor(mintOverLimit)
    })

    it("limits each IP, counting an IPv6 /64 as one", async () => {
      const fromIp = (ip: string) =>
        postHandoff("handled")({ headers: { "X-Forwarded-For": ip } })
          .then((res) => res.status)
          .catch(({ response }) => response.status)

      for (let i = 0; i < 60; i++) {
        expect(await fromIp("2001:db8:1:2::1")).toBe(401)
        expect(await fromIp("2001:db8:1:2:aaaa:bbbb:cccc:dddd")).toBe(401)
      }

      expect(await fromIp("2001:db8:1:2::ffff")).toBe(429)
      expect(await fromIp("2001:db8:1:3::1")).toBe(401)
    })

    it("answers 503 when not configured", async () => {
      config.COURSES_HANDOFF_SECRET = undefined

      return postHandoff("handled")({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(503)
        })
    })

    describe("CORS", () => {
      const preflight = (route: string, origin: string) =>
        createRequestHelpers(ctx.port).request("OPTIONS")(route)({
          headers: {
            Origin: origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization,content-type",
          },
        })

      it.each(["https://course.elementsofai.com", "https://www.mooc.fi"])(
        "lets %s call the mint",
        async (origin) => {
          const res = await preflight(
            "/api/credit-registration-handoff/handled",
            origin,
          )

          expect(res.headers["access-control-allow-origin"]).toBe(origin)
        },
      )

      it.each([
        "/api/credit-registration-handoff/handled",
        "/API/Credit-Registration-Handoff/handled",
      ])("keeps other sites from calling %s", async (route) => {
        const res = await preflight(route, "https://evil.example")

        expect(res.headers["access-control-allow-origin"]).toBeUndefined()
      })

      it("keeps the bare mooc.fi domain from calling the mint", async () => {
        const res = await preflight(
          "/api/credit-registration-handoff/handled",
          "https://mooc.fi",
        )

        expect(res.headers["access-control-allow-origin"]).toBeUndefined()
      })

      it("leaves other routes open", async () => {
        const res = await preflight(
          "/api/courses-handoff/redeem",
          "https://evil.example",
        )

        expect(res.headers["access-control-allow-origin"]).toBe("*")
      })
    })
  })
})
