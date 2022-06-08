export const isProduction = process.env.NODE_ENV === "production"
export const isTest = process.env.NODE_ENV === "test"

require("dotenv-safe").config({
  allowEmptyValues: isProduction || isTest,
})

export const isStaging = () =>
  (process.env.BACKEND_URL ?? "").includes("staging")

export const DEBUG = Boolean(process.env.DEBUG)

export const DATABASE_URL_WITHOUT_SCHEMA = (() => {
  const url = process.env.DATABASE_URL ?? ""
  const [baseUrl, queryParamString] = url.split("?") ?? []
  const queryParams = queryParamString?.split("&") ?? []
  const newParams = queryParams.filter((param) => !param.startsWith("schema="))

  return `${baseUrl}${newParams.length > 0 ? `?${newParams.join("&")}` : ""}`
})()

export const SEARCH_PATH = isProduction
  ? [process.env.SEARCH_PATH ?? "moocfi$production"]
  : isTest && process.env.RUNNING_IN_CI
  ? [process.env.SEARCH_PATH ?? ""]
  : ["default$default"]

export const DB_PORT = Number(process.env.DB_PORT)

export const {
  BACKEND_URL = "https://mooc.fi",
  FRONTEND_URL = "https://www.mooc.fi",
  // db
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
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
  // prisma log levels for debugging
  PRISMA_LOG_LEVELS,
  // circleci
  CIRCLECI,
  // nexus reflection
  NEXUS_REFLECTION,
} = process.env

export const DATABASE_URL =
  isTest && !CIRCLECI
    ? "postgres://prisma:prisma@localhost:5678/testing"
    : process.env.DATABASE_URL

export const PRIVATE_KEY_TEST = "config/mooc-private-test.pem"
export const PUBLIC_KEY_TEST = "config/mooc-public-test.pem"

export const extensionPath = CIRCLECI ? "public." : "extensions."

// addresses to send Linköping completions, separated by ;
export const LINKOPING_COMPLETION_RECIPIENTS =
  process.env.LINKOPING_COMPLETION_RECIPIENTS
