require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

export const isProduction = process.env.NODE_ENV === "production"
export const isTest = process.env.NODE_ENV === "test"

export const DEBUG = Boolean(process.env.DEBUG)
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
