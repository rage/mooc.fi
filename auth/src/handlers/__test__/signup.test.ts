import axios from "axios"

import { handlers } from "../"
import { next, okTokenResponse, req, res, testProfile } from "../../__test__"
import { FRONTEND_URL } from "../../config"

jest.mock("axios")

const mockedAxios = axios as jest.Mocked<typeof axios>

describe("signup", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedAxios.post.mockReset()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  const okRegisterResponse = {
    data: {
      status: 200,
      success: true,
      user: {},
      verified_user: {},
      tmc_user: undefined,
      tmc_id: 1,
      message: "User created",
    },
  }
  const existingUserRegisterResponse = {
    response: {
      data: {
        status: 401,
        success: false,
        user: {
          id: "1",
          email: "e@mail.com",
          administrator: false,
        },
        verified_user: {},
        tmc_user: undefined,
        tmc_id: 1,
        message: "User or verified user already exists",
      },
    },
  }
  const existingUserRegisterResponseWithAccessToken = {
    response: {
      data: {
        ...existingUserRegisterResponse.response.data,
        access_token: "access_token",
      },
    },
  }
  const existingUserAndVerifiedUserRegisterResponse = {
    response: {
      data: {
        ...existingUserRegisterResponse.response.data,
        verified_user: {
          id: 1,
        },
      },
    },
  }

  const errorRegisterResponse = {
    data: {
      status: 500,
      success: false,
      user: {},
      verified_user: {},
      message: "Error creating user",
    },
  }

  const handler = handlers["sign-up"]

  it("happy path success", async () => {
    mockedAxios.post.mockImplementation(async (url: string) => {
      if (url.includes("token")) {
        return okTokenResponse
      }

      return okRegisterResponse
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

  it("redirects to edit user details on non-successful TMC user creation", async () => {
    mockedAxios.post.mockImplementation(async (url: string) => {
      if (url.includes("token")) {
        return okTokenResponse
      }

      return {
        ...okRegisterResponse,
        data: {
          ...okRegisterResponse.data,
          tmc_id: -1,
        },
      }
    })
    await handler(req, res, next)(undefined, testProfile)

    expect(req.login).toHaveBeenCalledWith(testProfile, expect.any(Function))
    expect(req.logout).toHaveBeenCalled()
    expect(res.setMOOCCookies).toHaveBeenCalledWith({
      access_token: "access_token",
      mooc_token: "access_token",
      admin: false,
    })
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-up/edit-details`,
    )
  })

  it("redirects on error passed to handler", async () => {
    await handler(req, res, next)("error", undefined)

    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-up?error=auth-fail&message=error`,
    )
  })

  it("redirects on no user passed to handler", async () => {
    await handler(req, res, next)(undefined, undefined)

    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-up?error=auth-fail`,
    )
  })

  it("redirects on no edu_person_principal_name", async () => {
    await handler(req, res, next)(undefined, {})

    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-up?error=auth-fail`,
    )
  })

  it("errors on user already exists, verified user does not, no access_token", async () => {
    mockedAxios.post.mockRejectedValue(existingUserRegisterResponse)

    await handler(req, res, next)(undefined, testProfile)

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.setMOOCCookies).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-up?email=e%40mail.com&error=sign-up-error`,
    )
  })

  it("errors on user already exists, verified user does not, has access_token", async () => {
    mockedAxios.post.mockRejectedValue(
      existingUserRegisterResponseWithAccessToken,
    )
    await handler(req, res, next)(undefined, testProfile)

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.setMOOCCookies).toHaveBeenCalledWith({
      access_token: "access_token",
      mooc_token: "access_token",
      admin: false,
    })
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-up?error=verify-user`,
    )
  })

  it("errors on user and verified user already exist", async () => {
    mockedAxios.post.mockRejectedValue(
      existingUserAndVerifiedUserRegisterResponse,
    )
    await handler(req, res, next)(undefined, testProfile)

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-up?email=e%40mail.com&error=already-registered`,
    )
  })

  it("errors on token issue", async () => {
    mockedAxios.post.mockImplementation(async (url: string) => {
      if (url.includes("register")) {
        return okRegisterResponse
      }

      throw new Error("token issue")
    })

    await handler(req, res, next)(undefined, testProfile)

    expect(req.login).not.toHaveBeenCalled()
    expect(req.logout).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `${FRONTEND_URL}/fi/sign-up?error=token-issue&message=Error%3A%20token%20issue`,
    )
  })
})
