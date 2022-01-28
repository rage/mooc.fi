import axios from "axios"
import { Response } from "express"

import { handlers } from "../"
import { next, okTokenResponse, req, res, testProfile } from "../../__test__"
import { FRONTEND_URL } from "../../config"

global.debug = {} as typeof console
if (process.env.NODE_ENV !== "production") {
  Object.setPrototypeOf(debug, console)
}

jest.mock("axios")

const mockedAxios = axios as jest.Mocked<typeof axios>

describe("signin", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedAxios.post.mockReset()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  const okAffiliationResponse = {
    data: {
      status: 200,
      ok: true,
    },
  }
  const errorAffiliationResponse = {
    response: { data: { message: "person affiliation error" } },
  }
  const handler = handlers["sign-in"]

  it("happy path success", async () => {
    mockedAxios.post.mockImplementation(async (url: string) => {
      if (url.includes("token")) {
        return okTokenResponse
      }
      return okAffiliationResponse
    })
    await handler(req, res, next)(undefined, testProfile)

    expect(req.login).toHaveBeenCalledWith(testProfile, expect.any(Function))
    expect(req.logout).toHaveBeenCalled()
    expect(res.setMOOCCookies).toHaveBeenCalledWith({
      access_token: "access_token",
      mooc_token: "access_token",
      admin: false,
    })
    expect(res.redirect).toHaveBeenCalledWith(`${FRONTEND_URL}/fi/`)
  })

  it("redirects on error passed to handler", async () => {
    await handler(req, res, next)("error", undefined)

    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-in?error=auth-fail&message=error`,
    )
  })

  it("redirects on no user passed to handler", async () => {
    await handler(req, res, next)(undefined, undefined)

    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-in?error=auth-fail`,
    )
  })

  it("redirects on no edu_person_principal_name", async () => {
    await handler(req, res, next)(undefined, {})

    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-in?error=auth-fail`,
    )
  })

  it("redirects on access_token present", async () => {
    await handler(
      req,
      {
        ...res,
        locals: { access_token: "access_token" },
      } as unknown as Response,
      next,
    )(undefined, testProfile)

    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-in?error=already-signed-in`,
    )
  })

  it("errors on no token received", async () => {
    mockedAxios.post.mockRejectedValue({
      response: { data: { message: "token error" } },
    })

    await handler(req, res, next)(undefined, testProfile)

    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-in?error=no-user-found&message=token%20error`,
    )
  })

  it("does not error on person affiliation not updated", async () => {
    mockedAxios.post
      .mockResolvedValueOnce(okTokenResponse)
      .mockRejectedValueOnce(errorAffiliationResponse)

    await handler(req, res, next)(undefined, testProfile)

    expect(req.login).toHaveBeenCalledWith(testProfile, expect.any(Function))
    expect(req.logout).toHaveBeenCalled()
    expect(res.setMOOCCookies).toHaveBeenCalledWith({
      access_token: "access_token",
      mooc_token: "access_token",
      admin: false,
    })
    expect(res.redirect).toHaveBeenCalledWith(`${FRONTEND_URL}/fi/`)
  })
})
