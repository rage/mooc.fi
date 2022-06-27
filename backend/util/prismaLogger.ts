import type { Prisma, PrismaClient } from "@prisma/client"
import * as winston from "winston"

import { PRISMA_LOG_LEVELS } from "../config"

const logLevel: Prisma.LogLevel[] | undefined = PRISMA_LOG_LEVELS?.split(
  ",",
) as Prisma.LogLevel[]

export const logDefinition: Prisma.LogDefinition[] | undefined = logLevel?.map(
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
