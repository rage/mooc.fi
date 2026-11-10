import winston, { format } from "winston"
import Transport from "winston-transport"

import { isProduction, isStaging, NEXUS_REFLECTION } from "../config"
import type { Sentry as SentryClient } from "../services/sentry"

interface LoggerOptions {
  service: string
}

const myFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  return `${timestamp} ${level}: ${message}, ${JSON.stringify(metadata)}`
})

/** Reports error-level log entries to Sentry, tagged with the logging service. */
class SentryTransport extends Transport {
  constructor(
    private readonly sentry: typeof SentryClient,
    private readonly service: string,
  ) {
    super({ level: "error" })
  }

  override log(info: winston.LogEntry, next: () => void) {
    const { level: _level, message, stack, ...extra } = info
    this.sentry.withScope((scope) => {
      scope.setTag("service", this.service)
      scope.setExtras(extra)
      const error = info instanceof Error ? info : new Error(String(message))
      if (typeof stack === "string") {
        error.stack = stack
      }
      this.sentry.captureException(error)
    })
    next()
  }
}

export default function logger({ service }: LoggerOptions) {
  const transports: winston.transport[] = [new winston.transports.Console()]

  if (isProduction && !NEXUS_REFLECTION && !isStaging()) {
    transports.push(
      new SentryTransport(require("../services/sentry").Sentry, service),
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
