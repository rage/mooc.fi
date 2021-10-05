require("dotenv").config()

export const isProduction = process.env.NODE_ENV === "production"

export const HY_ORGANIZATION_SECRET =
  process.env.HY_ORGANIZATION_SECRET || "hy_secret"
export const HY_ORGANIZATION_ID =
  process.env.HY_ORGANIZATION_ID || "hy_organization"
export const PORT = process.env.PORT || 5000
export const BACKEND_URL =
  process.env.BACKEND_URL ?? (!isProduction ? "http://localhost:4000" : "")
export const FRONTEND_URL =
  process.env.FRONTEND_URL ?? (!isProduction ? "http://localhost:3000" : "")
export const AUTH_URL =
  process.env.AUTH_URL ?? (!isProduction ? "http://localhost:4000" : "")
export const API_URL =
  process.env.API_URL ?? (!isProduction ? "http://localhost:4000/api" : "")
export const DOMAIN = FRONTEND_URL?.replace(/(^https?:\/\/|:\d+)/g, "")

export const LOGOUT_URL = isProduction
  ? `${FRONTEND_URL}/Shibboleth.sso/Logout?return=`
  : ""

export const SHIBBOLETH_HEADERS = [
  "displayname",
  "givenName",
  "sn",
  "schacpersonaluniquecode",
  "schachomeorganization",
  "edupersonaffiliation",
  "mail",
  "o",
  "ou",
  "SHIB_LOGOUT_URL",
  "edupersonprincipalname"
] as const
export type HeaderField = typeof SHIBBOLETH_HEADERS[number]
export const requiredFields: HeaderField[] = [
  "schacpersonaluniquecode",
  "schachomeorganization",
  "edupersonprincipalname",
]


export const defaultHeaders: Record<HeaderField, string> = {
  displayname: "kissa kissanen",
  givenName: "kissa",
  sn: "kissanen",
  schachomeorganization: "helsinki.fi",
  schacpersonaluniquecode:
    "urn:schac:personalUniqueCode:int:studentID:helsinki.fi:121345678",
  edupersonaffiliation: "member;student",
  mail: "mail@helsinki.fi",
  edupersonprincipalname: "mail@helsinki.fi",
  o: "University of Helsinki",
  ou: "Department of Computer Science",
  SHIB_LOGOUT_URL: "https://example.com/logout",
}
