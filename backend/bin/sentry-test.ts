import sentryLogger from "./lib/logger"

require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

const logger = sentryLogger({ service: "sentry-test" })

const test = async () => {
  logger.info("this is a normal log")
  logger.error("this is an error")
}

test()