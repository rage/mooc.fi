import { createHash } from "crypto";
import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import { GRAPHQL_ENDPOINT_PATH } from "../server";
import redisClient from "../services/redis";

const CACHE_EXPIRE_TIME_SECONDS = 60 * 60; // 1 hour
const CACHE_PREFIX = "express-graphql-response-cache:";

function normalizeQuery(query: string): string {
  return query.replace(/\s+/g, " ").trim();
}

function stableStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  const seen = new WeakSet();
  const sorter = (_key: string, value: any) => {
    if (value && typeof value === "object") {
      if (seen.has(value)) return;
      seen.add(value);
      if (Array.isArray(value)) return value;
      return Object.keys(value)
        .sort()
        .reduce((acc, k) => {
          acc[k] = value[k];
          return acc;
        }, {} as Record<string, any>);
    }
    return value;
  };
  return JSON.stringify(obj, sorter);
}

function isGraphQLQuery(body: any): boolean {
  const src: string | undefined = body?.query;
  if (!src) return false;
  const q = src.trim().toLowerCase();
  return q.startsWith("query") || q.startsWith("{");
}

function buildCacheKey(req: Request): string {
  const body = req.body ?? {};
  const query = typeof body.query === "string" ? normalizeQuery(body.query) : "";
  const variables = body.variables ? stableStringify(body.variables) : "";
  const operationName = body.operationName ?? "";

  const payload = stableStringify({ query, variables, operationName });
  const hash = createHash("sha512").update(payload).digest("hex");
  return `${CACHE_PREFIX}${hash}`;
}

// Detect GraphQL errors in a response payload
function hasGraphQLErrors(body: any): boolean {
  try {
    const parsed =
      typeof body === "string"
        ? JSON.parse(body)
        : Buffer.isBuffer(body)
        ? JSON.parse(body.toString("utf8"))
        : body;

    return Boolean(parsed && Array.isArray(parsed.errors) && parsed.errors.length > 0);
  } catch {
    // If it isn't valid JSON, treat as unknown -> don't cache
    return true;
  }
}


const createExpressGraphqlCacheMiddleware = (logger: Logger) => {
  const expressCacheMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Only handle GraphQL endpoint POSTs
    const isGraphqlPath =
      req.originalUrl?.startsWith(GRAPHQL_ENDPOINT_PATH) ||
      `${req.baseUrl || ""}${req.path || ""}` === GRAPHQL_ENDPOINT_PATH;

    if (!isGraphqlPath || req.method !== "POST") return next();
    const client = redisClient();
    if (!client?.isReady) return next();

    // Skip if authenticated via Authorization header (per your setup)
    if (req.headers.authorization !== undefined) {
      logger.debug("GraphQL cache: skip (Authorization present)");
      return next();
    }

    // Only cache queries
    if (!isGraphQLQuery(req.body)) {
      logger.debug("GraphQL cache: skip (not a query)");
      return next();
    }

    try {
      const key = buildCacheKey(req);
      const cached = await client.get(key);

      if (cached) {
        logger.debug(`GraphQL cache: HIT ${key}`);
        res.status(200);
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("X-Cache", "HIT");
        res.send(cached);
        return;
      }

      // Cache MISS: wrap send to store only successful, error-free JSON responses
      const originalSend = res.send.bind(res);

      res.send = (body?: any): Response => {
        try {
          const status = res.statusCode;
          const is2xx = status >= 200 && status < 300;
          const contentType = (res.getHeader("Content-Type") || "").toString();
          const isJson = contentType.includes("application/json") || typeof body === "object";

          // Only cache if:
          // - HTTP 2xx
          // - JSON response
          // - NO GraphQL errors
          if (is2xx && isJson && client?.isReady && !hasGraphQLErrors(body)) {
            const payload =
              typeof body === "string"
                ? body
                : Buffer.isBuffer(body)
                ? body.toString("utf8")
                : JSON.stringify(body);

            client
              .set(key, payload, { EX: CACHE_EXPIRE_TIME_SECONDS })
              .then(() => logger.debug(`GraphQL cache: MISS -> STORED ${key}`))
              .catch((e: any) => logger.warn(`GraphQL cache: set error ${e}`));

            res.setHeader("X-Cache", "MISS");
          } else {
            logger.debug(
              `GraphQL cache: not stored (status=${status}, json=${isJson}, gqlErrors=${hasGraphQLErrors(
                body
              )})`
            );
            res.setHeader("X-Cache", "BYPASS");
          }
        } catch (e) {
          logger.warn(`GraphQL cache: error during set ${e}`);
        }
        return originalSend(body);
      };

      return next();
    } catch (e) {
      logger.error(`GraphQL cache: middleware error ${e}`);
      return next();
    }
  };

  return expressCacheMiddleware;
};

export default createExpressGraphqlCacheMiddleware;


/**
 * Invalidates all cached GraphQL query responses created by this middleware.
 * Returns the number of keys deleted.
 */
export async function invalidateAllGraphqlCachedQueries(
  logger?: Logger
): Promise<number> {
  const client = redisClient();
  if (!client?.isReady) {
    throw new Error("Redis client is not ready");
  }

  let deleted = 0;
  let failed = 0;

  try {
    let cursor = "0";
    do {
      const reply = await client.scan(cursor, {
        MATCH: `${CACHE_PREFIX}*`,
        COUNT: 1000,
      });
      cursor = reply.cursor;
      const keys = reply.keys;
      for (const key of keys) {
        try {
          await client.del(key);
          deleted += 1;
        } catch (e) {
          failed += 1;
          logger?.warn?.(`GraphQL cache: failed to delete key ${key}: ${e}`);
        }
      }
    } while (cursor !== "0");
    if (failed > 0) {
      logger?.warn?.(`GraphQL cache: invalidated ${deleted} keys, ${failed} deletions failed`);
    } else {
      logger?.info?.(`GraphQL cache: invalidated ${deleted} keys`);
    }
  } catch (e) {
    logger?.error?.(`GraphQL cache: invalidation error ${e}`);
    throw e;
  }

  return deleted;
}
