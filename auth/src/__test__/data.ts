import { NextFunction, Request, Response } from "express"

export const testProfile = {
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

export const req = {
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
export const res = {
  redirect: jest.fn().mockReturnThis(),
  locals: {},
  setMOOCCookies: jest.fn().mockReturnThis(),
} as unknown as Response
export const next = jest.fn() as NextFunction

export const okTokenResponse = {
  data: {
    status: 200,
    success: true,
    tmc_token: "tmc_token",
    access_token: "access_token",
    admin: false,
  },
}
