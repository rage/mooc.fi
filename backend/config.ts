/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { URL } from "url"

export const isProduction = process.env.NODE_ENV === "production"
export const isTest = process.env.NODE_ENV === "test"
export const isDev = !isProduction && !isTest

require("dotenv-safe").config({
  allowEmptyValues: isProduction || isTest,
})

export const isStaging = () =>
  (process.env.BACKEND_URL ?? "").includes("staging")

export const DEBUG = Boolean(process.env.DEBUG)

// database related
export const CIRCLECI = process.env.CIRCLECI
export const EXTENSION_PATH = "extensions"

const rawDatabaseURL =
  isTest && !CIRCLECI
    ? "postgres://prisma:prisma@localhost:5678/testing"
    : process.env.DATABASE_URL
const url = new URL((rawDatabaseURL ?? "").replaceAll('"', ""))
const defaultSearchPath = isProduction ? "moocfi$production" : "default$default"

const searchPath = url.searchParams.get("schema")?.split(",") ?? []
if (searchPath.length === 0) {
  searchPath.push(defaultSearchPath)
}
if (isTest && process.env.RUNNING_IN_CI) {
  searchPath.push(EXTENSION_PATH)
}

const parsedConnectionLimit = Number(process.env.CONNECTION_LIMIT)
export const CONNECTION_LIMIT =
  isNaN(parsedConnectionLimit) || parsedConnectionLimit === 0
    ? url.searchParams.get("connection_limit")
    : parsedConnectionLimit

if (CONNECTION_LIMIT) {
  url.searchParams.set("connection_limit", CONNECTION_LIMIT.toString())
} else {
  url.searchParams.delete("connection_limit")
}
export const APPLICATION_NAME =
  process.env.APPLICATION_NAME ??
  url.searchParams.get("application_name") ??
  "moocfi"
url.searchParams.set("application_name", APPLICATION_NAME)

export const DATABASE_URL = url.href

url.searchParams.delete("schema")
const port = url.port ? Number(url.port) : 5432

export const DB_HOST = url.hostname
export const DB_PORT = !isNaN(port) ? port : 5432
export const DB_USER = url.username
export const DB_PASSWORD = url.password
export const DB_NAME = url.pathname.replace("/", "") ?? undefined
export const DATABASE_URL_WITHOUT_SCHEMA = url.href
export const DB_CONNECTION_PARAMS = Object.fromEntries(url.searchParams)
export const SEARCH_PATH = searchPath

export const {
  BACKEND_URL = "https://mooc.fi",
  FRONTEND_URL = "https://www.mooc.fi",
  CERTIFICATES_URL = "https://certificates.mooc.fi",
  // sentry, new relic
  NEW_RELIC_LICENSE_KEY,
  SENTRY_DSN,
  GIT_COMMIT,
  // not used?
  UPDATE_USER_SECRET,
  // avoin
  AVOIN_COURSE_URL,
  AVOIN_TOKEN,
  // userAppDatum
  CONFIG_NAME,
  // kafka
  KAFKA_CONSUMER_GROUP,
  KAFKA_TOP_OF_THE_QUEUE,
  KAFKA_DEBUG_CONTEXTS,
  KAFKA_BRIDGE_SECRET,
  KAFKA_BRIDGE_SERVER_HOST,
  KAFKA_BRIDGE_SERVER_PORT,
  KAFKA_HOST,
  // EoAI/BAI slack post url
  AI_SLACK_URL,
  // email delivery
  SMTP_FROM,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  // tmc
  TMC_HOST,
  TMC_CLIENT_ID,
  TMC_CLIENT_SECRET,
  TMC_PASSWORD,
  TMC_USERNAME,
  RATELIMIT_PROTECTION_SAFE_API_KEY = "",
  // keys
  PUBLIC_KEY,
  PRIVATE_KEY,
  // google cloud storage for image uploads
  GOOGLE_CLOUD_STORAGE_BUCKET,
  GOOGLE_CLOUD_STORAGE_KEYFILE,
  GOOGLE_CLOUD_STORAGE_PROJECT,
  // quiznator (!)
  QUIZNATOR_HOST,
  QUIZNATOR_TOKEN,
  // redis
  REDIS_URL = "redis://127.0.0.1:7001",
  REDIS_PASSWORD,
  USER_HASH_SECRET = "",
  // prisma log levels for debugging
  PRISMA_LOG_LEVELS,
  // nexus reflection
  NEXUS_REFLECTION,
  // Linköping University/Prague completion addresses, separated by :
  LINKOPING_COMPLETION_RECIPIENTS,
  PRAGUE_COMPLETION_RECIPIENTS,
  ELEMENTS_CONSENTED_USERS_RECIPIENTS,
} = process.env

export const PRIVATE_KEY_TEST = "config/mooc-private-test.pem"
export const PUBLIC_KEY_TEST = "config/mooc-public-test.pem"

export const REDIS_DB = process.env.REDIS_DB ? Number(process.env.REDIS_DB) : 4
