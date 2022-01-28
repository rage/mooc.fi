import { Request, Response } from "express"
import nock from "nock"

import { handlers } from "../"
import { next, req, res, testProfile } from "../../__test__"
import { BACKEND_URL, FRONTEND_URL } from "../../config"

// jest.mock("graphql-request")

const resWithAccessToken = {
  ...res,
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

    await handler(req, resWithAccessToken, next)(undefined, testProfile)

    expect(req.login).toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/profile/?tab=connections&success=true`,
    )
  })

  it("errors on error passed to handler", async () => {
    await handler(req, resWithAccessToken, next)("error", undefined)

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/profile/?tab=connections&success=false&error=auth-fail&message=error`,
    )
  })

  it("errors on no user passed to handler", async () => {
    await handler(req, resWithAccessToken, next)(undefined, undefined)

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/profile/?tab=connections&success=false&error=no-user`,
    )
  })

  it("errors on no edu_person_principal_name", async () => {
    await handler(req, resWithAccessToken, next)(undefined, {})

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/profile/?tab=connections&success=false&error=no-user`,
    )
  })

  it("errors on no access_token", async () => {
    await handler(req, res, next)(undefined, testProfile)

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/profile/?tab=connections&success=false&error=not-logged-in`,
    )
  })

  it("errors on mutation error", async () => {
    nock(BACKEND_URL).post("/").reply(401, {
      data: {},
    })

    await handler(req, resWithAccessToken, next)(undefined, testProfile)

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/profile/?tab=connections&success=false&error=auth-fail&message=GraphQL%20error`,
    )
  })

  it("adjusts redirect URL according to origin", async () => {
    const reqWithOrigin = {
      ...req,
      query: {
        ...req.query,
        origin: "connect",
      },
    } as unknown as Request
    await handler(reqWithOrigin, resWithAccessToken, next)("error", undefined)

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/profile/connect/failure?error=auth-fail&message=error`,
    )
  })
})
