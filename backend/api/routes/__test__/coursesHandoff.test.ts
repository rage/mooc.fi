import { createHmac, randomUUID } from "crypto"

import jwt from "jsonwebtoken"
import nock from "nock"

import { TMC_HOST } from "../../../config"
import {
  createRequestHelpers,
  FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
  getTestContext,
  RequestPost,
  setupTMCWithDefaultFakeUsers,
} from "../../../tests"
import { seed } from "../../../tests/data"

const COURSES_BASE_URL = "http://courses.test"
const REDEEM_PATH = "/api/v0/moocfi/outbound-handoffs/redeem"
const ISSUE_PATH = "/api/v8/application/user_access_tokens"
const JWT_SECRET = "test-jwt-secret"
const CONTINUATION_AUDIENCE = "courses-handoff-continuation"
const HANDOFF_TOKEN = "a".repeat(32) + "B9".repeat(16)
const SAME_SITE_ARRIVAL = {
  Cookie: "other=x; __Host-courses_handoff_same_site_arrival=1",
}

jest.mock("../../../config", () => ({
  ...jest.requireActual("../../../config"),
  COURSES_BASE_URL: "http://courses.test",
  JWT_SECRET: "test-jwt-secret",
  TMC_TOKEN_ISSUER_CLIENT_ID: "issuer-id",
  TMC_TOKEN_ISSUER_CLIENT_SECRET: "issuer-secret",
}))

const config = jest.requireMock("../../../config")

const ctx = getTestContext()

const HANDLER_COURSE_ID = "00000000-0000-0000-0000-000000000666"
const HANDLED_COURSE_ID = "00000000-0000-0000-0000-000000000667"
const CERTIFICATE_PATH = "/register-completion/handler/certificate/"

const continuationKey = createHmac("sha256", JWT_SECRET)
  .update(CONTINUATION_AUDIENCE)
  .digest()

const signContinuation = (
  options: jwt.SignOptions = {},
  key: jwt.Secret = continuationKey,
) =>
  jwt.sign(
    { moocfi_course_id: HANDLER_COURSE_ID, destination: "certificate" },
    key,
    {
      algorithm: "HS256",
      audience: CONTINUATION_AUDIENCE,
      subject: "3",
      expiresIn: "2m",
      jwtid: randomUUID(),
      ...options,
    },
  )

const redeemedHandoff = (
  upstream_id: number,
  moocfi_course_id = HANDLER_COURSE_ID,
) =>
  nock(COURSES_BASE_URL)
    .post(REDEEM_PATH, { token: HANDOFF_TOKEN, client_ip: "203.0.113.7" })
    .matchHeader("authorization", "Bearer handoff-secret")
    .reply(200, { upstream_id, moocfi_course_id, destination: "certificate" })

const issuedToken = (user_id: number, reply: [number, object]) => {
  nock(TMC_HOST ?? "")
    .post("/oauth/token", (body) => body.grant_type === "client_credentials")
    .optionally()
    .reply(200, { access_token: "issuer-token", expires_in: 7200 })
  return nock(TMC_HOST ?? "")
    .post(ISSUE_PATH, { user_id })
    .matchHeader("authorization", "Bearer issuer-token")
    .reply(...reply)
}

const expectError = (request: Promise<unknown>, status: number, data: object) =>
  request
    .then(() => fail())
    .catch(({ response }) => {
      expect(response.status).toBe(status)
      expect(response.data).toEqual(data)
    })

describe("API", () => {
  setupTMCWithDefaultFakeUsers({
    "Bearer stale": [401, {}],
    "Bearer unchecked": [500, {}],
  })

  let post: (route: string) => RequestPost

  beforeEach(async () => {
    await seed(ctx.prisma)
    config.COURSES_HANDOFF_SECRET = "handoff-secret"
    post = createRequestHelpers(ctx.port).post
  })

  describe("/api/courses-handoff/redeem", () => {
    const redeem = (headers: object = {}, token = HANDOFF_TOKEN) =>
      post("/api/courses-handoff/redeem")({
        data: { token },
        headers: { "X-Forwarded-For": "203.0.113.7", ...headers },
      })

    it("continues when the student is already signed in", async () => {
      const courses = redeemedHandoff(1)

      const res = await redeem(FAKE_NORMAL_USER_AUTHORIZATION_HEADERS)

      expect(res.data).toEqual({
        result: "continue",
        destination_path: CERTIFICATE_PATH,
      })
      expect(courses.isDone()).toBe(true)
    })

    it("signs in a signed-out student who came from courses.mooc.fi, to the handler course's certificate", async () => {
      redeemedHandoff(1, HANDLED_COURSE_ID)
      const tmc = issuedToken(1, [
        200,
        { access_token: "issued", token_type: "bearer" },
      ])

      const res = await redeem(SAME_SITE_ARRIVAL)

      expect(res.data).toEqual({
        result: "signed_in",
        access_token: "issued",
        destination_path: CERTIFICATE_PATH,
      })
      expect(tmc.isDone()).toBe(true)
      expect(res.headers["set-cookie"]).toEqual([
        expect.stringMatching(
          /^__Host-courses_handoff_same_site_arrival=;.*Path=\/;.*Expires=Thu, 01 Jan 1970.*Secure/,
        ),
      ])
    })

    it("asks a signed-out student who came from elsewhere to confirm the account", async () => {
      redeemedHandoff(3)

      const res = await redeem()

      expect(res.data).toEqual({
        result: "confirm",
        continuation: expect.any(String),
        email: "third@organization.fi",
        destination_path: CERTIFICATE_PATH,
      })
    })

    it("confirms with no email for an account mooc.fi does not have", async () => {
      redeemedHandoff(99)

      const res = await redeem()

      expect(res.data).toMatchObject({ result: "confirm", email: null })
    })

    it("treats a session TMC rejects as signed out", async () => {
      redeemedHandoff(1)
      issuedToken(1, [200, { access_token: "issued" }])

      const res = await redeem({
        Authorization: "Bearer stale",
        ...SAME_SITE_ARRIVAL,
      })

      expect(res.data).toMatchObject({ result: "signed_in" })
    })

    it("leaves the token unspent when TMC cannot check the session", async () => {
      const redeemAtCourses = nock(COURSES_BASE_URL).post(REDEEM_PATH)
      const courses = redeemAtCourses.reply(200, {})

      await expectError(redeem({ Authorization: "Bearer unchecked" }), 502, {
        type: "unavailable",
      })
      expect(courses.isDone()).toBe(false)
      nock.removeInterceptor(redeemAtCourses)
    })

    it("offers a retryable confirmation when TMC fails to sign in a student from courses.mooc.fi", async () => {
      redeemedHandoff(3)
      issuedToken(3, [500, {}])

      const res = await redeem(SAME_SITE_ARRIVAL)

      expect(res.data).toEqual({
        result: "confirm",
        continuation: expect.any(String),
        email: "third@organization.fi",
        destination_path: CERTIFICATE_PATH,
      })
    })

    it("offers a two-minute continuation when signed in as another account, even from courses.mooc.fi", async () => {
      redeemedHandoff(3)

      const res = await redeem({
        ...FAKE_NORMAL_USER_AUTHORIZATION_HEADERS,
        ...SAME_SITE_ARRIVAL,
      })

      expect(res.data).toEqual({
        result: "different_account",
        continuation: expect.any(String),
        email: "third@organization.fi",
        destination_path: CERTIFICATE_PATH,
      })
      const claims = jwt.verify(res.data.continuation, continuationKey, {
        algorithms: ["HS256"],
        audience: CONTINUATION_AUDIENCE,
      }) as jwt.JwtPayload
      expect(claims).toMatchObject({
        sub: "3",
        destination: "certificate",
        jti: expect.any(String),
      })
      expect((claims.exp ?? 0) - (claims.iat ?? 0)).toBe(120)
    })

    it("asks for a password sign-in when TMC will not issue a token", async () => {
      redeemedHandoff(1)
      issuedToken(1, [403, {}])

      return expectError(redeem(SAME_SITE_ARRIVAL), 403, {
        type: "sign_in_required",
        destination_path: CERTIFICATE_PATH,
      })
    })

    it("answers 410 for a used or expired token", async () => {
      nock(COURSES_BASE_URL).post(REDEEM_PATH).reply(410, {})

      return expectError(redeem(), 410, { type: "expired" })
    })

    it("tells a student who opened the link from another network", async () => {
      nock(COURSES_BASE_URL)
        .post(REDEEM_PATH)
        .reply(410, { type: "ip_mismatch" })

      return expectError(redeem(), 410, { type: "ip_mismatch" })
    })

    it.each([
      ["too short", "a".repeat(63)],
      ["too long", "a".repeat(65)],
      ["non-alphanumeric", "a".repeat(63) + "-"],
      ["padded", ` ${"a".repeat(63)}`],
    ])(
      "refuses a %s token without asking courses.mooc.fi",
      async (_, token) => {
        const toCourses = nock(COURSES_BASE_URL).post(REDEEM_PATH)
        const courses = toCourses.reply(200)

        await expectError(redeem({}, token), 400, { type: "invalid" })
        expect(courses.isDone()).toBe(false)
        nock.removeInterceptor(toCourses)
      },
    )

    it("does not follow a redirect from courses.mooc.fi", async () => {
      nock(COURSES_BASE_URL)
        .post(REDEEM_PATH)
        .reply(307, {}, { Location: "http://elsewhere.test/redeem" })
      const toElsewhere = nock("http://elsewhere.test").post("/redeem")
      const elsewhere = toElsewhere.reply(200)

      await expectError(redeem(), 502, { type: "unavailable" })
      expect(elsewhere.isDone()).toBe(false)
      nock.removeInterceptor(toElsewhere)
    })

    it("answers 400 for a token courses.mooc.fi does not know", async () => {
      nock(COURSES_BASE_URL).post(REDEEM_PATH).reply(400, {})

      return expectError(redeem(), 400, { type: "invalid" })
    })

    it("answers 503 when not configured", async () => {
      config.COURSES_HANDOFF_SECRET = undefined

      return expectError(redeem(), 503, { type: "not_configured" })
    })
  })

  describe("/api/courses-handoff/continue", () => {
    const continueWith = (continuation: string) =>
      post("/api/courses-handoff/continue")({ data: { continuation } })

    it("signs in the account the continuation names", async () => {
      issuedToken(3, [200, { access_token: "issued" }])

      const res = await continueWith(signContinuation())

      expect(res.data).toEqual({
        result: "signed_in",
        access_token: "issued",
        destination_path: CERTIFICATE_PATH,
      })
    })

    it("works only once", async () => {
      issuedToken(3, [200, { access_token: "issued" }])
      const continuation = signContinuation()

      await continueWith(continuation)

      return expectError(continueWith(continuation), 410, { type: "expired" })
    })

    it("stays usable after TMC fails to issue a token", async () => {
      issuedToken(3, [500, {}])
      const continuation = signContinuation()

      await expectError(continueWith(continuation), 502, {
        type: "unavailable",
      })

      issuedToken(3, [200, { access_token: "issued" }])
      const res = await continueWith(continuation)
      expect(res.data).toMatchObject({ result: "signed_in" })
    })

    it("refuses a continuation without an id", async () => {
      const withoutId = jwt.sign(
        { moocfi_course_id: HANDLER_COURSE_ID, destination: "certificate" },
        continuationKey,
        { audience: CONTINUATION_AUDIENCE, subject: "3", expiresIn: "2m" },
      )

      return expectError(continueWith(withoutId), 400, { type: "invalid" })
    })

    it("answers 410 for an expired continuation", async () => {
      return expectError(
        continueWith(signContinuation({ expiresIn: -10 })),
        410,
        { type: "expired" },
      )
    })

    it("refuses a token for another audience", async () => {
      return expectError(
        continueWith(signContinuation({ audience: "other" })),
        400,
        { type: "invalid" },
      )
    })

    it("refuses a token signed with another key", async () => {
      return expectError(continueWith(signContinuation({}, JWT_SECRET)), 400, {
        type: "invalid",
      })
    })
  })

  describe("rate limit", () => {
    it("limits redeem and continue together per IP", async () => {
      const fromIp = (ip: string, route: string) =>
        post(route)({ data: {}, headers: { "X-Forwarded-For": ip } })
          .then((res) => res.status)
          .catch(({ response }) => response.status)

      for (let i = 0; i < 60; i++) {
        expect(await fromIp("203.0.113.1", "/api/courses-handoff/redeem")).toBe(
          400,
        )
        expect(
          await fromIp("203.0.113.1", "/api/courses-handoff/continue"),
        ).toBe(400)
      }

      expect(await fromIp("203.0.113.1", "/api/courses-handoff/redeem")).toBe(
        429,
      )
      expect(await fromIp("203.0.113.2", "/api/courses-handoff/redeem")).toBe(
        400,
      )
    })
  })
})
