import WinstonSentry from "winston-sentry-log"
import winston from "winston"
import { Sentry } from "../../services/sentry"

interface LoggerOptions {
  service: string
}

export default function logger({ service }: LoggerOptions) {
  return winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    defaultMeta: { service },
    transports: [
      new winston.transports.Console(),
      new WinstonSentry({
        tags: [service],
        sentryClient: Sentry,
        isClientInitialized: true,
      }),
    ],
  })
}
