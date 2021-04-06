import type { PrismaClient } from "@prisma/client"
import * as winston from "winston"

type LogLevel = "info" | "query" | "warn" | "error"
type LogDefinition = {
  level: LogLevel
  emit: "stdout" | "event"
}

const logLevel: LogLevel[] | undefined = process.env.PRISMA_LOG_LEVELS?.split(
  ",",
) as LogLevel[]
export const logDefinition: LogDefinition[] | undefined = logLevel?.map(
  (level) => ({
    emit: "event",
    level,
  }),
)

interface AttachPrismaEvents {
  logger: winston.Logger
  prisma: PrismaClient
}

export const attachPrismaEvents = ({ logger, prisma }: AttachPrismaEvents) => {
  logDefinition?.forEach(({ level }) => {
    switch (level) {
      case "query":
        // @ts-ignore: dynamic log types
        prisma.$on(level, (e) => {
          logger.info(e)
        })
        break
      case "info":
        // @ts-ignore: dynamic log types
        prisma.$on(level, (e) => logger.info(e))
        break
      case "warn":
        // @ts-ignore: dynamic log types
        prisma.$on(level, (e) => logger.warn(e))
        break
      case "error":
        // @ts-ignore: dynamic log types
        prisma.$on(level, (e) => logger.error(e))
        break
    }
  })
}
