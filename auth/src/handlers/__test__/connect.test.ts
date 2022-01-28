import { Response } from "express"
import nock from "nock"

import { handlers } from "../"
import { next, req, res as _res, testProfile } from "../../__test__"
import { BACKEND_URL, FRONTEND_URL } from "../../config"

// jest.mock("graphql-request")

const res = {
  ..._res,
  locals: {
    cookie: {
      access_token: "access_token",
    },
  },
} as unknown as Response

describe("connect", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  const handler = handlers["connect"]

  it("happy path", async () => {
    nock(BACKEND_URL)
      .post("/")
      .reply(200, {
        data: {
          addVerifiedUser: {
            verified_user: {
              display_name: "kissa",
            },
          },
        },
      })

    await handler(req, res, next)(undefined, testProfile)

    expect(req.login).toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/profile/connect/success`,
    )
  })

  it("redirects on error passed to handler", async () => {
    await handler(req, res, next)("error", undefined)

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/profile/connect/failure?error=auth-fail`,
    )
  })

  it("redirects on no user passed to handler", async () => {
    await handler(req, res, next)(undefined, undefined)

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/profile/connect/failure?error=auth-fail`,
    )
  })

  it("redirects on no edu_person_principal_name", async () => {
    await handler(req, res, next)(undefined, {})

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/profile/connect/failure?error=auth-fail`,
    )
  })

  it("redirects on mutation error", async () => {
    nock(BACKEND_URL).post("/").reply(401, {
      data: {},
    })

    await handler(req, res, next)(undefined, testProfile)

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/profile/connect/failure?error=auth-fail`,
    )
  })
})
