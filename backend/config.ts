export const isProduction = process.env.NODE_ENV === "production"
export const isTest = process.env.NODE_ENV === "test"

require("dotenv-safe").config({
  allowEmptyValues: isProduction || isTest,
})

export const NEXUS_REFLECTION = process.env.NEXUS_REFLECTION

export const BACKEND_URL = process.env.BACKEND_URL ?? "https://mooc.fi"
export const FRONTEND_URL = process.env.FRONTEND_URL ?? "https://www.mooc.fi"

export const isStaging = () =>
  (process.env.BACKEND_URL ?? "").includes("staging")

export const DEBUG = Boolean(process.env.DEBUG)

// database related
export const DB_HOST = process.env.DB_HOST
export const DB_PORT = Number(process.env.DB_PORT)
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_NAME = process.env.DB_NAME
export const CIRCLECI = process.env.CIRCLECI
export const DATABASE_URL =
  isTest && !CIRCLECI
    ? "postgres://prisma:prisma@localhost:5678/testing"
    : process.env.DATABASE_URL
export const DATABASE_URL_WITHOUT_SCHEMA = (() => {
  const url = process.env.DATABASE_URL ?? ""
  const [baseUrl, queryParamString] = url.split("?") ?? []
  const queryParams = queryParamString?.split("&") ?? []
  const newParams = queryParams.filter((param) => !param.startsWith("schema="))

  return `${baseUrl}${newParams.length > 0 ? "?" : ""}${newParams.join("&")}`
})()

export const SEARCH_PATH = isProduction
  ? [process.env.SEARCH_PATH ?? "moocfi$production"]
  : isTest && process.env.RUNNING_IN_CI
  ? [process.env.SEARCH_PATH ?? ""]
  : ["default$default"]

// sentry, new relic
export const NEW_RELIC_LICENSE_KEY = process.env.NEW_RELIC_LICENSE_KEY
export const SENTRY_DSN = process.env.SENTRY_DSN
export const GIT_COMMIT = process.env.GIT_COMMIT

export const UPDATE_USER_SECRET = process.env.UPDATE_USER_SECRET

export const AVOIN_COURSE_URL = process.env.AVOIN_COURSE_URL
export const AVOIN_TOKEN = process.env.AVOIN_TOKEN

// userAppDatum related
export const CONFIG_NAME = process.env.CONFIG_NAME

export const KAFKA_CONSUMER_GROUP = process.env.KAFKA_CONSUMER_GROUP
export const KAFKA_TOP_OF_THE_QUEUE = process.env.KAFKA_TOP_OF_THE_QUEUE
export const KAFKA_DEBUG_CONTEXTS = process.env.KAFKA_DEBUG_CONTEXTS

export const KAFKA_BRIDGE_SECRET = process.env.KAFKA_BRIDGE_SECRET
export const KAFKA_BRIDGE_SERVER_HOST = process.env.KAFKA_BRIDGE_SERVER_HOST
export const KAFKA_BRIDGE_SERVER_PORT = process.env.KAFKA_BRIDGE_SERVER_PORT
export const KAFKA_HOST = process.env.KAFKA_HOST

export const AI_SLACK_URL = process.env.AI_SLACK_URL

export const SMTP_FROM = process.env.SMTP_FROM
export const SMTP_HOST = process.env.SMTP_HOST
export const SMTP_PORT = process.env.SMTP_PORT
export const SMTP_USER = process.env.SMTP_USER
export const SMTP_PASS = process.env.SMTP_PASS

export const TMC_HOST = process.env.TMC_HOST
export const TMC_CLIENT_ID = process.env.TMC_CLIENT_ID
export const TMC_CLIENT_SECRET = process.env.TMC_CLIENT_SECRET
export const TMC_PASSWORD = process.env.TMC_PASSwORD
export const TMC_USERNAME = process.env.TMC_USERNAME
export const RATELIMIT_PROTECTION_SAFE_API_KEY =
  process.env.RATELIMIT_PROTECTION_SAFE_API_KEY ?? ""

export const PUBLIC_KEY = process.env.PUBLIC_KEY
export const PRIVATE_KEY = process.env.PRIVATE_KEY
export const PRIVATE_KEY_TEST = "config/mooc-private-test.pem"
export const PUBLIC_KEY_TEST = "config/mooc-public-test.pem"

export const GOOGLE_CLOUD_STORAGE_BUCKET =
  process.env.GOOGLE_CLOUD_STORAGE_BUCKET
export const GOOGLE_CLOUD_STORAGE_PROJECT =
  process.env.GOOGLE_CLOUD_STORAGE_PROJECT
export const GOOGLE_CLOUD_STORAGE_KEYFILE =
  process.env.GOOGLE_CLOUD_STORAGE_KEYFILE

export const QUIZNATOR_HOST = process.env.QUIZNATOR_HOST
export const QUIZNATOR_TOKEN = process.env.QUIZNATOR_TOKEN

export const REDIS_URL = process.env.REDIS_URL ?? "redis://127.0.0.1:7001"
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD

export const PRISMA_LOG_LEVELS = process.env.PRISMA_LOG_LEVELS

export const extensionPath = CIRCLECI ? "public." : "extensions."
