import { plugin } from "nexus"

import { Context } from "../context"

const SLOW_RESOLVER_THRESHOLD_MS = 100

function buildFieldPath(path: any): string {
  const parts: string[] = []
  let current = path
  let depth = 0

  while (current) {
    if (current.key) {
      parts.unshift(String(current.key))
      depth++
    }
    current = current.prev
  }

  return parts.join(".")
}

export const loggerPlugin = () =>
  plugin({
    name: "LoggerPlugin",
    onCreateFieldResolver(_) {
      return async (
        root: any,
        args: any,
        ctx: Context,
        info: any,
        next: any,
      ) => {
        const startTime = Date.now()
        const isRootLevel = !info.path?.prev
        const fieldPath = buildFieldPath(info.path)
        const correlationId = ctx.req?.timing?.correlationId

        if (isRootLevel) {
          ctx?.logger?.info("GraphQL root operation", {
            correlationId,
            operation: info.operation.operation,
            field: info.path.key,
            args: JSON.stringify(args),
          })
        }

        try {
          const result = await next(root, args, ctx, info)
          const duration = Date.now() - startTime

          if (duration > SLOW_RESOLVER_THRESHOLD_MS) {
            ctx?.logger?.warn("Slow field resolver", {
              correlationId,
              path: fieldPath,
              parentType: info.parentType.name,
              fieldName: info.fieldName,
              duration,
              depth: fieldPath.split(".").length - 1,
            })
          } else if (!isRootLevel) {
            ctx?.logger?.debug("Field resolver completed", {
              correlationId,
              path: fieldPath,
              parentType: info.parentType.name,
              fieldName: info.fieldName,
              duration,
            })
          }

          return result
        } catch (error) {
          const duration = Date.now() - startTime
          ctx?.logger?.error("Field resolver error", {
            correlationId,
            path: fieldPath,
            parentType: info.parentType.name,
            fieldName: info.fieldName,
            duration,
            error: error instanceof Error ? error.message : String(error),
          })
          throw error
        }
      }
    },
  })
