import fs from "fs"
import path from "path"
import { URL } from "url"

export const isProduction = process.env.NODE_ENV === "production"
export const isTest = process.env.NODE_ENV === "test"
export const isDev = process.env.NODE_ENV === "development"

require("dotenv").config({
  path: path.join(
    __dirname,
    `../.env${isDev ? ".development" : isTest ? ".test" : ""}`,
  ),
})

/*export const HY_ORGANIZATION_SECRET =
  process.env.HY_ORGANIZATION_SECRET || "hy_secret"
export const HY_ORGANIZATION_ID =
  process.env.HY_ORGANIZATION_ID || "hy_organization"*/
export const PORT = process.env.PORT || 5000
export const BACKEND_URL =
  process.env.BACKEND_URL ?? (!isProduction ? "http://localhost:4000" : "")
export const FRONTEND_URL =
  process.env.FRONTEND_URL ?? (!isProduction ? "http://localhost:3000" : "")
export const AUTH_URL =
  process.env.AUTH_URL ?? (!isProduction ? "http://localhost:4000" : "")
export const API_URL =
  process.env.API_URL ?? (!isProduction ? "http://localhost:4000/api" : "")
export const DOMAIN = new URL(FRONTEND_URL).hostname
export const HY_IDP_URL = process.env.HY_IDP_URL ?? ""
export const HAKA_IDP_URL = process.env.HAKA_IDP_URL ?? ""
export const SP_URL = process.env.SP_URL ?? ""

export const SP_PATH = new URL(SP_URL).pathname

export const MOOCFI_CERTIFICATE =
  isProduction || isTest
    ? process.env.MOOCFI_CERTIFICATE ?? ""
    : fs
        .readFileSync(__dirname + "/../certs/mooc.fi.crt", "utf-8")
        .toString() ?? ""

export const MOOCFI_PRIVATE_KEY =
  isProduction || isTest
    ? process.env.MOOCFI_PRIVATE_KEY ?? ""
    : fs
        .readFileSync(__dirname + "/../certs/mooc.fi.key", "utf-8")
        .toString() ?? ""

export const HY_CERTIFICATE = process.env.HY_CERTIFICATE ?? ""
// isProduction ? process.env.HY_CERTIFICATE ?? "" : "",

export const HAKA_CERTIFICATE = process.env.HAKA_CERTIFICATE ?? ""
// isProduction ? process.env.HAKA_CERTIFICATE ?? "" : "",

export const {
  HY_METADATA_URL = "",
  HY_METADATA_CERTIFICATE_URL = "",
  HAKA_METADATA_URL = "",
  HAKA_METADATA_CERTIFICATE_URL = "",
} = process.env

if (isProduction && (!BACKEND_URL || !FRONTEND_URL)) {
  throw new Error("BACKEND_URL and FRONTEND_URL must be set")
}
if (!HY_IDP_URL || !HAKA_IDP_URL) {
  throw new Error("HY_IDP_URL and HAKA_IDP_URL must be set")
}
if (!HY_CERTIFICATE || !HAKA_CERTIFICATE) {
  throw new Error("HY_CERTIFICATE and HAKA_CERTIFICATE must be set")
}
/*export const LOGOUT_URL = isProduction
  ? `${FRONTEND_URL}/Shibboleth.sso/Logout?return=`
  : ""
*/
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
  "edupersonprincipalname",
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

export const PASSPORT_STRATEGY = "hy-haka"

export const { USE_MULTISAML } = process.env
