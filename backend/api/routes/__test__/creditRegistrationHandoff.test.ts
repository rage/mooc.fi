import nock from "nock"

import {
  createRequestHelpers,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
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

      const res = await postHandoff("handled")({})

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
      })
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

    it("answers 502 when courses.mooc.fi refuses", async () => {
      nock(COURSES_BASE_URL)
        .post(MINT_PATH)
        .reply(409, { type: "cutoff_mismatch" })

      return postHandoff("handled")({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(502)
          expect(response.data).toEqual({
            message: "Could not open courses.mooc.fi",
          })
        })
    })

    it("answers 503 when not configured", async () => {
      config.COURSES_HANDOFF_SECRET = undefined

      return postHandoff("handled")({})
        .then(() => fail())
        .catch(({ response }) => {
          expect(response.status).toBe(503)
        })
    })
  })
})
