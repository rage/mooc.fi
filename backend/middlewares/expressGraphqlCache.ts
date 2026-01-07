import { createHash } from "crypto"

import { NextFunction, Request, Response } from "express"
import { Logger } from "winston"

import { GRAPHQL_ENDPOINT_PATH } from "../server"
import redisClient from "../services/redis"
import { trackMiddlewareTiming } from "./requestTiming"

const CACHE_EXPIRE_TIME_SECONDS = 60 * 60 // 1 hour
const CACHE_PREFIX = "express-graphql-response-cache:"

function normalizeQuery(query: string): string {
  return query.replace(/\s+/g, " ").trim()
}

function stableStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj)
  const seen = new WeakSet()
  const sorter = (_key: string, value: any) => {
    if (value && typeof value === "object") {
      if (seen.has(value)) return
      seen.add(value)
      if (Array.isArray(value)) return value
      return Object.keys(value)
        .sort()
        .reduce(
          (acc, k) => {
            acc[k] = value[k]
            return acc
          },
          {} as Record<string, any>,
        )
    }
    return value
  }
  return JSON.stringify(obj, sorter)
}

function isGraphQLQuery(body: any): boolean {
  const src: string | undefined = body?.query
  if (!src) return false
  const q = src.trim().toLowerCase()
  return q.startsWith("query") || q.startsWith("{")
}

function buildCacheKey(req: Request): string {
  const body = req.body ?? {}
  const query = typeof body.query === "string" ? normalizeQuery(body.query) : ""
  const variables = body.variables ? stableStringify(body.variables) : ""
  const operationName = body.operationName ?? ""

  const payload = stableStringify({ query, variables, operationName })
  const hash = createHash("sha512").update(payload).digest("hex")
  return `${CACHE_PREFIX}${hash}`
}

// Detect GraphQL errors in a response payload
function hasGraphQLErrors(body: any): boolean {
  try {
    const parsed =
      typeof body === "string"
        ? JSON.parse(body)
        : Buffer.isBuffer(body)
        ? JSON.parse(body.toString("utf8"))
        : body

    return Boolean(
      parsed && Array.isArray(parsed.errors) && parsed.errors.length > 0,
    )
  } catch {
    // If it isn't valid JSON, treat as unknown -> don't cache
    return true
  }
}

const createExpressGraphqlCacheMiddleware = (logger: Logger) => {
  const expressCacheMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const cacheStartTime = Date.now()

    logger.info("GraphQL cache: middleware invoked", {
      correlationId: req.timing?.correlationId,
      method: req.method,
      path: req.originalUrl || req.path,
      baseUrl: req.baseUrl,
      graphqlPath: GRAPHQL_ENDPOINT_PATH,
    })

    // Only handle GraphQL endpoint POSTs
    const isGraphqlPath =
      req.originalUrl?.startsWith(GRAPHQL_ENDPOINT_PATH) ||
      `${req.baseUrl || ""}${req.path || ""}` === GRAPHQL_ENDPOINT_PATH

    if (!isGraphqlPath || req.method !== "POST") {
      logger.info("GraphQL cache: skip (not GraphQL POST request)", {
        correlationId: req.timing?.correlationId,
        method: req.method,
        path: req.originalUrl || req.path,
        isGraphqlPath,
      })
      trackMiddlewareTiming(req, "graphqlCache", cacheStartTime)
      return next()
    }

    const client = redisClient()
    if (!client?.isReady) {
      logger.warn("GraphQL cache: skip (Redis client not ready)", {
        correlationId: req.timing?.correlationId,
      })
      trackMiddlewareTiming(req, "graphqlCache", cacheStartTime)
      return next()
    }

    // Skip if authenticated via Authorization header (per your setup)
    if (req.headers.authorization !== undefined) {
      logger.info("GraphQL cache: skip (Authorization header present)", {
        correlationId: req.timing?.correlationId,
      })
      trackMiddlewareTiming(req, "graphqlCache", cacheStartTime)
      return next()
    }

    // Only cache queries
    if (!isGraphQLQuery(req.body)) {
      logger.info("GraphQL cache: skip (not a GraphQL query)", {
        correlationId: req.timing?.correlationId,
        bodyType: typeof req.body,
        hasQuery: !!req.body?.query,
      })
      trackMiddlewareTiming(req, "graphqlCache", cacheStartTime)
      return next()
    }

    try {
      const key = buildCacheKey(req)
      const operationName = req.body?.operationName || "unnamed"
      const cached = await client.get(key)

      if (cached) {
        trackMiddlewareTiming(req, "graphqlCache", cacheStartTime)
        logger.info("GraphQL cache: HIT", {
          correlationId: req.timing?.correlationId,
          key,
          operationName,
          cacheKey: key.substring(CACHE_PREFIX.length),
        })
        res.status(200)
        res.setHeader("Content-Type", "application/json; charset=utf-8")
        res.setHeader("X-Cache", "HIT")
        res.send(cached)
        return
      }

      logger.info("GraphQL cache: MISS", {
        correlationId: req.timing?.correlationId,
        key,
        operationName,
        cacheKey: key.substring(CACHE_PREFIX.length),
      })

      // Cache MISS: wrap send to store only successful, error-free JSON responses
      const originalSend = res.send.bind(res)

      res.send = (body?: any): Response => {
        trackMiddlewareTiming(req, "graphqlCache", cacheStartTime)
        try {
          const status = res.statusCode
          const is2xx = status >= 200 && status < 300
          const contentType = (res.getHeader("Content-Type") ?? "").toString()
          const isJson =
            contentType.includes("application/json") || typeof body === "object"
          const hasErrors = hasGraphQLErrors(body)

          // Only cache if:
          // - HTTP 2xx
          // - JSON response
          // - NO GraphQL errors
          if (is2xx && isJson && client?.isReady && !hasErrors) {
            const payload =
              typeof body === "string"
                ? body
                : Buffer.isBuffer(body)
                ? body.toString("utf8")
                : JSON.stringify(body)

            client
              .set(key, payload, { EX: CACHE_EXPIRE_TIME_SECONDS })
              .then(() => {
                logger.info("GraphQL cache: STORED", {
                  correlationId: req.timing?.correlationId,
                  key,
                  operationName,
                  cacheKey: key.substring(CACHE_PREFIX.length),
                  ttl: CACHE_EXPIRE_TIME_SECONDS,
                  payloadSize: payload.length,
                })
              })
              .catch((e: any) => {
                logger.error("GraphQL cache: failed to store", {
                  correlationId: req.timing?.correlationId,
                  key,
                  operationName,
                  error: e instanceof Error ? e.message : String(e),
                })
              })

            res.setHeader("X-Cache", "MISS")
          } else {
            const reason = !is2xx
              ? `status=${status}`
              : !isJson
              ? "not JSON"
              : hasErrors
              ? "GraphQL errors present"
              : "unknown"
            logger.info("GraphQL cache: not stored", {
              correlationId: req.timing?.correlationId,
              key,
              operationName,
              reason,
              status,
              isJson,
              hasErrors,
            })
            res.setHeader("X-Cache", "BYPASS")
          }
        } catch (e) {
          logger.error("GraphQL cache: error during response handling", {
            correlationId: req.timing?.correlationId,
            key,
            error: e instanceof Error ? e.message : String(e),
            stack: e instanceof Error ? e.stack : undefined,
          })
        }
        return originalSend(body)
      }

      return next()
    } catch (e) {
      trackMiddlewareTiming(req, "graphqlCache", cacheStartTime)
      logger.error("GraphQL cache: middleware error", {
        correlationId: req.timing?.correlationId,
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
        path: req.originalUrl || req.path,
      })
      return next()
    }
  }

  return expressCacheMiddleware
}

export default createExpressGraphqlCacheMiddleware

/**
 * Invalidates all cached GraphQL query responses created by this middleware.
 * Returns the number of keys deleted.
 */
export async function invalidateAllGraphqlCachedQueries(
  logger?: Logger,
): Promise<number> {
  const client = redisClient()
  if (!client?.isReady) {
    logger?.error("GraphQL cache: invalidation failed (Redis client not ready)")
    throw new Error("Redis client is not ready")
  }

  logger?.info("GraphQL cache: starting invalidation of all cached queries")

  let deleted = 0
  let failed = 0
  let scanIterations = 0

  try {
    let cursor = "0"
    do {
      scanIterations += 1
      const reply = await client.scan(cursor, {
        MATCH: `${CACHE_PREFIX}*`,
        COUNT: 1000,
      })
      cursor = reply.cursor
      const keys = reply.keys
      logger?.info("GraphQL cache: scan iteration", {
        iteration: scanIterations,
        keysFound: keys.length,
        cursor,
      })

      for (const key of keys) {
        try {
          await client.del(key)
          deleted += 1
        } catch (e) {
          failed += 1
          logger?.warn("GraphQL cache: failed to delete key", {
            key,
            error: e instanceof Error ? e.message : String(e),
          })
        }
      }
    } while (cursor !== "0")

    if (failed > 0) {
      logger?.warn("GraphQL cache: invalidation completed with errors", {
        deleted,
        failed,
        total: deleted + failed,
        scanIterations,
      })
    } else {
      logger?.info("GraphQL cache: invalidation completed successfully", {
        deleted,
        scanIterations,
      })
    }
  } catch (e) {
    logger?.error("GraphQL cache: invalidation error", {
      error: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
      deleted,
      failed,
      scanIterations,
    })
    throw e
  }

  return deleted
}
