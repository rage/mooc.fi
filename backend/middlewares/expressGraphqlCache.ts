import { createHash } from "crypto"

import { NextFunction, Request, Response } from "express"
import { Logger } from "winston"

import { GRAPHQL_ENDPOINT_PATH } from "../server"
import redisClient, {
  cacheGet,
  cacheSet,
  isCacheReady,
} from "../services/redis"

const CACHE_EXPIRE_TIME_SECONDS = 60 * 60 * 5 // 5 hours
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

export function getLanguage(req: Request): string {
  const header = req.headers["accept-language"]
  return (Array.isArray(header) ? header.join(",") : header) ?? ""
}

function hashPayload(payload: unknown): string {
  return createHash("sha512").update(stableStringify(payload)).digest("hex")
}

function normalizeOperation(op: any) {
  return {
    query: typeof op?.query === "string" ? normalizeQuery(op.query) : "",
    variables: op?.variables ? stableStringify(op.variables) : "",
    operationName: op?.operationName ?? "",
  }
}

function buildCacheKey(req: Request): string {
  const hash = hashPayload({
    ...normalizeOperation(req.body),
    language: getLanguage(req),
  })
  return `${CACHE_PREFIX}${hash}`
}

function isBatchedRequest(body: any): boolean {
  return Array.isArray(body) && body.length > 0
}

function buildBatchCacheKey(req: Request): string {
  const hash = hashPayload({
    batch: (req.body as any[]).map(normalizeOperation),
    language: getLanguage(req),
  })
  return `${CACHE_PREFIX}batch:${hash}`
}

function getOperationType(op: any): string {
  const src = op?.query?.trim().toLowerCase() || ""
  return src.startsWith("mutation")
    ? "mutation"
    : src.startsWith("subscription")
    ? "subscription"
    : src.startsWith("query") || src.startsWith("{")
    ? "query"
    : "unknown"
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

function toPayload(body: any): string {
  return typeof body === "string"
    ? body
    : Buffer.isBuffer(body)
    ? body.toString("utf8")
    : JSON.stringify(body)
}

/** Why a response must not be stored, or `undefined` when it is cacheable. */
function getBypassReason(
  res: Response,
  body: any,
  isBatch: boolean,
): string | undefined {
  const status = res.statusCode
  if (status < 200 || status >= 300) {
    return `status=${status}`
  }
  const contentType = (res.getHeader("Content-Type") ?? "").toString()
  if (!contentType.includes("application/json") && typeof body !== "object") {
    return "not JSON"
  }
  if (!isBatch) {
    return hasGraphQLErrors(body) ? "GraphQL errors present" : undefined
  }
  const responses = Array.isArray(body) ? body : JSON.parse(toPayload(body))
  if (!Array.isArray(responses)) {
    return "batch response is not an array"
  }
  return responses.some(hasGraphQLErrors) ? "GraphQL errors present" : undefined
}

const createExpressGraphqlCacheMiddleware = (logger: Logger) => {
  /** Stores error-free 2xx JSON responses once they are sent. */
  const storeOnSend = (
    res: Response,
    key: string,
    isBatch: boolean,
    operationNames: string,
  ) => {
    const originalSend = res.send.bind(res)

    res.send = (body?: any): Response => {
      try {
        const reason = getBypassReason(res, body, isBatch)
        if (reason) {
          logger.debug("GraphQL cache: not stored", {
            key,
            operationNames,
            reason,
          })
          res.setHeader("X-Cache", "BYPASS")
        } else {
          void cacheSet(key, toPayload(body), CACHE_EXPIRE_TIME_SECONDS, {
            logger,
          })
          res.setHeader("X-Cache", "MISS")
        }
      } catch (e) {
        logger.error("GraphQL cache: error during response handling", {
          key,
          error: e instanceof Error ? e.message : String(e),
          stack: e instanceof Error ? e.stack : undefined,
        })
      }
      return originalSend(body)
    }
  }

  const expressCacheMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    logger.debug("GraphQL cache: middleware invoked", {
      method: req.method,
      path: req.originalUrl || req.path,
      baseUrl: req.baseUrl,
      graphqlPath: GRAPHQL_ENDPOINT_PATH,
    })

    const isGraphqlPath =
      req.originalUrl?.startsWith(GRAPHQL_ENDPOINT_PATH) ||
      `${req.baseUrl || ""}${req.path || ""}` === GRAPHQL_ENDPOINT_PATH

    if (!isGraphqlPath || req.method !== "POST") {
      logger.debug("GraphQL cache: skip (not GraphQL POST request)", {
        method: req.method,
        path: req.originalUrl || req.path,
        isGraphqlPath,
      })
      return next()
    }

    if (!isCacheReady()) {
      logger.debug("GraphQL cache: skip (Redis client not ready)")
      return next()
    }

    if (req.headers.authorization !== undefined) {
      logger.debug("GraphQL cache: skip (Authorization header present)")
      return next()
    }

    const isBatch = isBatchedRequest(req.body)
    const operations: any[] = isBatch ? req.body : [req.body ?? {}]

    if (!operations.every(isGraphQLQuery)) {
      logger.debug("GraphQL cache: skip (contains non-queries)", {
        path: req.originalUrl || req.path,
        batchSize: operations.length,
        operationTypes: operations.map(getOperationType),
        operationNames: operations.map((op) => op?.operationName || "unnamed"),
      })
      return next()
    }

    try {
      const key = isBatch ? buildBatchCacheKey(req) : buildCacheKey(req)
      const operationNames = operations
        .map((op) => op.operationName || "unnamed")
        .join(", ")
      const cached = await cacheGet(key, { logger })

      if (cached) {
        logger.debug("GraphQL cache: HIT", { key, operationNames })
        res.status(200)
        res.setHeader("Content-Type", "application/json; charset=utf-8")
        res.setHeader("X-Cache", "HIT")
        res.send(cached)
        return
      }

      logger.debug("GraphQL cache: MISS", { key, operationNames })
      storeOnSend(res, key, isBatch, operationNames)
      return next()
    } catch (e) {
      logger.error("GraphQL cache: middleware error", {
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
