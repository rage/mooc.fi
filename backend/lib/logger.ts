import winston, { format } from "winston"
import WinstonSentry from "winston-sentry-log"

import { isProduction, isStaging, NEXUS_REFLECTION } from "../config"

interface LoggerOptions {
  service: string
}

const myFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  return `${timestamp} ${level}: ${message}, ${JSON.stringify(metadata)}`
})

export default function logger({ service }: LoggerOptions) {
  const transports: winston.transport[] = [new winston.transports.Console()]

  if (isProduction && !NEXUS_REFLECTION && !isStaging()) {
    transports.push(
      new WinstonSentry({
        tags: {
          service,
        },
        level: "error",
        sentryClient: require("../services/sentry").Sentry,
        isClientInitialized: true,
        fingerprint: service,
      }),
    )
  }

  return winston.createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.colorize(),
      myFormat,
    ),
    defaultMeta: { service },
    transports,
  })
}
