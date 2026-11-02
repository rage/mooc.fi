import { createHmac } from "crypto"

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
      expiresIn: "10m",
      ...options,
    },
  )

const redeemedHandoff = (
  upstream_id: number,
  moocfi_course_id = HANDLER_COURSE_ID,
) =>
  nock(COURSES_BASE_URL)
    .post(REDEEM_PATH, { token: "handoff-token" })
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
    const redeem = (headers: object = {}) =>
      post("/api/courses-handoff/redeem")({
        data: { token: "handoff-token" },
        headers,
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

    it("signs a signed-out student in, to the handler course's certificate", async () => {
      redeemedHandoff(1, HANDLED_COURSE_ID)
      const tmc = issuedToken(1, [
        200,
        { access_token: "issued", token_type: "bearer", expires_in: 86400 },
      ])

      const res = await redeem()

      expect(res.data).toEqual({
        result: "signed_in",
        access_token: "issued",
        expires_in: 86400,
        destination_path: CERTIFICATE_PATH,
      })
      expect(tmc.isDone()).toBe(true)
    })

    it("treats a session TMC rejects as signed out", async () => {
      redeemedHandoff(1)
      issuedToken(1, [200, { access_token: "issued", expires_in: 86400 }])

      const res = await redeem({ Authorization: "Bearer stale" })

      expect(res.data).toMatchObject({ result: "signed_in" })
    })

    it("does not replace a session TMC could not check", async () => {
      redeemedHandoff(99)
      issuedToken(99, [200, { access_token: "issued" }])

      return expectError(redeem({ Authorization: "Bearer unchecked" }), 502, {
        type: "unavailable",
      })
    })

    it("offers a continuation when signed in as another account", async () => {
      redeemedHandoff(3)

      const res = await redeem(FAKE_NORMAL_USER_AUTHORIZATION_HEADERS)

      expect(res.data).toEqual({
        result: "different_account",
        continuation: expect.any(String),
        destination_path: CERTIFICATE_PATH,
      })
      expect(
        jwt.verify(res.data.continuation, continuationKey, {
          algorithms: ["HS256"],
          audience: CONTINUATION_AUDIENCE,
        }),
      ).toMatchObject({ sub: "3", destination: "certificate" })
    })

    it("asks for a password sign-in when TMC will not issue a token", async () => {
      redeemedHandoff(1)
      issuedToken(1, [403, {}])

      return expectError(redeem(), 403, {
        type: "sign_in_required",
        destination_path: CERTIFICATE_PATH,
      })
    })

    it("answers 410 for a used or expired token", async () => {
      nock(COURSES_BASE_URL).post(REDEEM_PATH).reply(410, {})

      return expectError(redeem(), 410, { type: "expired" })
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
      issuedToken(3, [200, { access_token: "issued", expires_in: 86400 }])

      const res = await continueWith(signContinuation())

      expect(res.data).toEqual({
        result: "signed_in",
        access_token: "issued",
        expires_in: 86400,
        destination_path: CERTIFICATE_PATH,
      })
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
})
