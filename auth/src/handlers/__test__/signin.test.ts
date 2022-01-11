import axios from "axios"
import { NextFunction, Request, Response } from "express"

import { handlers } from "../"
import { FRONTEND_URL } from "../../config"

global.debug = {} as typeof console
if (process.env.NODE_ENV !== "production") {
  Object.setPrototypeOf(debug, console)
}

jest.mock("axios")

const mockedAxios = axios as jest.Mocked<typeof axios>

const testProfile = {
  edu_person_affiliation: "",
  edu_person_principal_name: "test",
  schac_home_organization: "helsinki.fi",
  organizational_unit: "organizational_unit",
  schac_personal_unique_code:
    "urn:schac:personalUniqueCode:int:studentID:helsinki.fi:121345678",
  display_name: "test",
  given_name: "test",
  mail: "test@mail.com",
}

describe("signin", () => {
  beforeEach(() => {
    mockedAxios.post.mockReset()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  const req = {
    body: {},
    query: {
      RelayState: JSON.stringify({
        language: "fi",
        provider: "hy",
        action: "sign-in",
      }),
    },
    params: {},
    login: jest.fn().mockImplementation((_: any, fn: Function) => fn(null)),
    logout: jest.fn(),
  } as unknown as Request
  const res = {
    redirect: jest.fn().mockReturnThis(),
    locals: {},
    setMOOCCookies: jest.fn().mockReturnThis(),
  } as unknown as Response
  const next = jest.fn() as NextFunction
  const okTokenResponse = {
    data: {
      status: 200,
      success: true,
      tmc_token: "tmc_token",
      access_token: "access_token",
      admin: false,
    },
  }
  const okAffiliationResponse = {
    data: {
      status: 200,
      ok: true,
    },
  }
  const errorAffiliationResponse = {
    response: { data: { message: "person affiliation error" } },
  }

  it("happy path success", async () => {
    mockedAxios.post.mockImplementation(async (url: string) => {
      if (url.includes("token")) {
        return okTokenResponse
      }
      return okAffiliationResponse
    })

    const handler = handlers["sign-in"]

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
    await handlers["sign-in"](req, res, next)("error", undefined)

    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-in?error=auth-fail&message=error`,
    )
  })

  it("redirects on no user passed to handler", async () => {
    await handlers["sign-in"](req, res, next)(undefined, undefined)

    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-in?error=auth-fail`,
    )
  })

  it("redirects on no edu_person_principal_name", async () => {
    await handlers["sign-in"](req, res, next)(undefined, {})

    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-in?error=auth-fail`,
    )
  })

  it("redirects on access_token present", async () => {
    await handlers["sign-in"](
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

    await handlers["sign-in"](req, res, next)(undefined, testProfile)

    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-in?error=no-user-found&message=token%20error`,
    )
  })

  it("does not error on person affiliation not updated", async () => {
    mockedAxios.post
      .mockResolvedValueOnce(okTokenResponse)
      .mockRejectedValueOnce(errorAffiliationResponse)

    await handlers["sign-in"](req, res, next)(undefined, testProfile)

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
