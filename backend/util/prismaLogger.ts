import { AsyncLocalStorage } from "async_hooks"

import { type Prisma } from "@prisma/client"

import { PRISMA_LOG_LEVELS } from "../config"
import { ServerContext } from "../context"

const logLevel = (PRISMA_LOG_LEVELS?.split(",") ?? []) as Prisma.LogLevel[]

export const logDefinition: Prisma.LogDefinition[] = logLevel.map((level) => ({
  emit: "event",
  level,
}))

type PrismaEventsContext = Pick<ServerContext, "logger" | "prisma">

interface RequestContext {
  correlationId?: string
}

export const prismaContextStorage = new AsyncLocalStorage<RequestContext>()

export const attachPrismaEvents = ({ logger, prisma }: PrismaEventsContext) => {
  logDefinition.forEach(({ level }) => {
    switch (level) {
      case "query":
        // @ts-ignore: dynamic log types
        prisma.$on(level, (e) => {
          const context = prismaContextStorage.getStore()
          const correlationId = context?.correlationId

          logger.info("Prisma query", {
            correlationId,
            query: e.query,
            params: e.params,
            duration: e.duration,
            target: e.target,
          })
        })
        break
      case "info":
        // @ts-ignore: dynamic log types
        prisma.$on(level, (e) => {
          const context = prismaContextStorage.getStore()
          const correlationId = context?.correlationId

          logger.info("Prisma info", {
            correlationId,
            message: e.message,
            target: e.target,
          })
        })
        break
      case "warn":
        // @ts-ignore: dynamic log types
        prisma.$on(level, (e) => {
          const context = prismaContextStorage.getStore()
          const correlationId = context?.correlationId

          logger.warn("Prisma warning", {
            correlationId,
            message: e.message,
            target: e.target,
          })
        })
        break
      case "error":
        // @ts-ignore: dynamic log types
        prisma.$on(level, (e) => {
          const context = prismaContextStorage.getStore()
          const correlationId = context?.correlationId

          logger.error("Prisma error", {
            correlationId,
            message: e.message,
            target: e.target,
          })
        })
        break
    }
  })
}
