import { Logger } from "winston"

import { ApolloServerPlugin } from "@apollo/server"

import { Context } from "../context"

interface ApolloTiming {
  parseStart?: number
  parseEnd?: number
  validateStart?: number
  validateEnd?: number
  executeStart?: number
  executeEnd?: number
  fieldResolvers: Array<{
    path: string
    duration: number
  }>
}

export const createApolloPerformancePlugin = (
  logger: Logger,
): ApolloServerPlugin<Context> => {
  return {
    async requestDidStart() {
      const timing: ApolloTiming = {
        fieldResolvers: [],
      }

      return {
        async didResolveOperation(requestContext) {
          const req = requestContext.contextValue.req as any
          const correlationId = req?.timing?.correlationId

          if (requestContext.operationName) {
            logger.info("GraphQL operation started", {
              correlationId,
              operationName: requestContext.operationName,
              operation: requestContext.operation?.operation,
            })
          }
        },

        async parsingDidStart() {
          timing.parseStart = Date.now()
          return async () => {
            timing.parseEnd = Date.now()
          }
        },

        async validationDidStart() {
          timing.validateStart = Date.now()
          return async () => {
            timing.validateEnd = Date.now()
          }
        },

        async executionDidStart(requestContext) {
          timing.executeStart = Date.now()
          const operationName = requestContext.operationName
          const req = requestContext.contextValue.req as any
          const correlationId =
            req?.timing?.correlationId ??
            requestContext.contextValue.correlationId

          return {
            async executionDidEnd() {
              timing.executeEnd = Date.now()

              const parseDuration = timing.parseEnd
                ? timing.parseEnd - (timing.parseStart ?? 0)
                : 0
              const validateDuration = timing.validateEnd
                ? timing.validateEnd - (timing.validateStart ?? 0)
                : 0
              const executeDuration = timing.executeEnd
                ? timing.executeEnd - (timing.executeStart ?? 0)
                : 0

              logger.info("GraphQL execution completed", {
                correlationId,
                operationName: operationName ?? "unnamed",
                timings: {
                  parse: parseDuration,
                  validate: validateDuration,
                  execute: executeDuration,
                  total: parseDuration + validateDuration + executeDuration,
                },
                fieldResolvers: timing.fieldResolvers,
              })
            },
          }
        },

        async willResolveField(fieldResolverInfo: any) {
          const startTime = Date.now()
          const path = buildFieldPath(fieldResolverInfo.info.path)

          const req = fieldResolverInfo.contextValue.req as any
          const correlationId =
            req?.timing?.correlationId ??
            fieldResolverInfo.contextValue.correlationId

          return () => {
            const duration = Date.now() - startTime
            timing.fieldResolvers.push({ path, duration })

            if (duration > 100) {
              logger.warn("Slow field resolver detected", {
                correlationId,
                path,
                duration,
                parentType: fieldResolverInfo.info.parentType.name,
                fieldName: fieldResolverInfo.info.fieldName,
              })
            }
          }
        },
      }
    },
  }
}

function buildFieldPath(path: any): string {
  const parts: string[] = []
  let current = path

  while (current) {
    if (current.key) {
      parts.unshift(String(current.key))
    }
    current = current.prev
  }

  return parts.join(".")
}
