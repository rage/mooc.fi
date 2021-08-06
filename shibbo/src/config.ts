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
export const DOMAIN = FRONTEND_URL?.replace(/(^https?:\/\/|:\d+)/g, "")

export const SHIBBOLETH_HEADERS = [
  "displayname",
  "schacpersonaluniquecode",
  "schachomeorganization",
  "edupersonaffiliation",
  "mail",
  "o",
  "ou",
  "SHIB_LOGOUT_URL",
] as const
export type HeaderField = typeof SHIBBOLETH_HEADERS[number]
export const requiredFields: HeaderField[] = [
  "schacpersonaluniquecode",
  "schachomeorganization",
  "mail",
]
