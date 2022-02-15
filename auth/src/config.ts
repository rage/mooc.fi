import fs from "fs"
import path from "path"
import { URL } from "url"

const isProduction = process.env.NODE_ENV === "production"
const isTest = process.env.NODE_ENV === "test"
const isDev = process.env.NODE_ENV === "development"

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
const PORT = process.env.PORT || 5000
const BACKEND_URL =
  process.env.BACKEND_URL ?? (!isProduction ? "http://localhost:4000" : "")
const FRONTEND_URL =
  process.env.FRONTEND_URL ?? (!isProduction ? "http://localhost:3000" : "")
const AUTH_URL =
  process.env.AUTH_URL ?? (!isProduction ? "http://localhost:4000" : "")
const API_URL =
  process.env.API_URL ?? (!isProduction ? "http://localhost:4000/api" : "")
const DOMAIN = new URL(FRONTEND_URL).hostname
const SP_URL = process.env.SP_URL ?? ""

const SP_PATH = new URL(SP_URL).pathname

const MOOCFI_CERTIFICATE =
  isProduction || isTest
    ? process.env.MOOCFI_CERTIFICATE ?? ""
    : fs
        .readFileSync(__dirname + "/../certs/mooc.fi.crt", "utf-8")
        .toString() ?? ""

const MOOCFI_PRIVATE_KEY =
  isProduction || isTest
    ? process.env.MOOCFI_PRIVATE_KEY ?? ""
    : fs
        .readFileSync(__dirname + "/../certs/mooc.fi.key", "utf-8")
        .toString() ?? ""

const {
  HY_CERTIFICATE = "",
  HAKA_CERTIFICATE = "",
  HY_METADATA_URL = "",
  HY_METADATA_CERTIFICATE_URL = "",
  HAKA_METADATA_URL = "",
  HAKA_METADATA_CERTIFICATE_URL = "",
} = process.env

if (isProduction && (!BACKEND_URL || !FRONTEND_URL)) {
  throw new Error("BACKEND_URL and FRONTEND_URL must be set")
}
if (!HY_CERTIFICATE || !HAKA_CERTIFICATE) {
  throw new Error("HY_CERTIFICATE and HAKA_CERTIFICATE must be set")
}
/*export const LOGOUT_URL = isProduction
  ? `${FRONTEND_URL}/Shibboleth.sso/Logout?return=`
  : ""
*/
const SHIBBOLETH_HEADERS = [
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
type HeaderField = typeof SHIBBOLETH_HEADERS[number]
const requiredFields: HeaderField[] = [
  "schacpersonaluniquecode",
  "schachomeorganization",
  "edupersonprincipalname",
]

const defaultHeaders: Record<HeaderField, string> = {
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

const METADATA_DIR = __dirname + "/../metadata"
const CERTS_DIR = __dirname + "/../certs"

const { USE_MULTISAML } = process.env

export {
  API_URL,
  AUTH_URL,
  BACKEND_URL,
  CERTS_DIR,
  defaultHeaders,
  DOMAIN,
  FRONTEND_URL,
  HAKA_CERTIFICATE,
  HAKA_METADATA_CERTIFICATE_URL,
  HAKA_METADATA_URL,
  HeaderField,
  HY_CERTIFICATE,
  HY_METADATA_CERTIFICATE_URL,
  HY_METADATA_URL,
  isDev,
  isProduction,
  isTest,
  METADATA_DIR,
  MOOCFI_CERTIFICATE,
  MOOCFI_PRIVATE_KEY,
  PORT,
  requiredFields,
  SHIBBOLETH_HEADERS,
  SP_PATH,
  SP_URL,
  USE_MULTISAML,
}
