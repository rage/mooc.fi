import winston, { format } from "winston"

interface LoggerOptions {
  service: string
  [key: string]: any
}

const myFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  return `${timestamp} ${level}: ${message}, ${JSON.stringify(metadata)}`
})

export function createLogger({ service, ...rest }: LoggerOptions) {
  const transports: winston.transport[] = [new winston.transports.Console()]

  return winston.createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.colorize(),
      myFormat,
    ),
    defaultMeta: { service, ...rest },
    transports,
  })
}
