import { createHash } from "crypto"

import { NextFunction, Request, Response } from "express"
import { Logger } from "winston"

import { GRAPHQL_ENDPOINT_PATH } from "../server"
import redisClient from "../services/redis"

const CACHE_EXPIRE_TIME_SECONDS = 300

/** Express middleware, used for caching graphql queries before they hit the graphql server
Only used for queries and for requests that are not authenticated.  */
const createExpressGraphqlCacheMiddleware = (logger: Logger) => {
  const expressCacheMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!redisClient || !redisClient.isReady) {
      return next()
    }
    // if user is logged in, return
    if (req.headers.authorization !== undefined) {
      logger.info(`Skipping express cache, authorization header is set`)
      return next()
    }
    // Only handle graphql
    if (req.path !== GRAPHQL_ENDPOINT_PATH || req.method !== "POST") {
      return next()
    }

    try {
      const key = `express-graphql-response-cache-${createHash("sha512")
        .update(JSON.stringify(req.body))
        .digest("hex")}`
      const cachedResponseBody = await redisClient.get(key)
      if (cachedResponseBody) {
        logger.info(
          `Express cache: Was able to find graphql response body from cache ${key}`,
        )
        res.status(200)
        res.setHeader("Content-Type", "application/json")
        res.send(cachedResponseBody)
        return
      }
      // Not found in cache, continue to graphql server but store the response in the cache
      const originalSend = res.send
      res.send = (body) => {
        try {
          if (redisClient && redisClient.isReady) {
            logger.info(
              `Express cache: Storing graphql response body to cache ${key}`,
            )
            // Returns a promise but awaiting it here would be inconvenient and not necessary. It will get resolved eventually.
            redisClient.set(key, body, { EX: CACHE_EXPIRE_TIME_SECONDS })
          }
        } catch (e) {
          logger.error(`Error when saving value to the express cache: ${e}`)
        }

        return originalSend.call(res, body)
      }
    } catch (e) {
      logger.error(`Error in express cache: ${e} `)
      return next()
    }
  }

  return expressCacheMiddleware
}

export default createExpressGraphqlCacheMiddleware
