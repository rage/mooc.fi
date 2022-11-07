import { type Prisma } from "@prisma/client"

import { PRISMA_LOG_LEVELS } from "../config"
import { ServerContext } from "../context"

const logLevel = (PRISMA_LOG_LEVELS?.split(
  ",",
) ?? []) as Prisma.LogLevel[]

export const logDefinition: Prisma.LogDefinition[] = logLevel.map(
  (level) => ({
    emit: "event",
    level,
  }),
)

export const attachPrismaEvents = ({ logger, prisma }: ServerContext) => {
  logDefinition.forEach(({ level }) => {
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
