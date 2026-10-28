import { Response } from "express"
import { Logger } from "winston"

import { withCacheTimeout } from "../services/cacheTimeout"
import redisClient from "../services/redis"

const PUBLIC_CACHE_PREFIX = "public-api:"
// Bumping the version orphans every cached response at once; in-flight builds
// write under the version they read, so they can't resurrect stale data.
const PUBLIC_CACHE_VERSION_KEY = `${PUBLIC_CACHE_PREFIX}version`
const PUBLIC_CACHE_TTL_SECONDS = 5 * 60
const BROWSER_MAX_AGE_SECONDS = 60
const LANGUAGE_PATTERN = /^[a-z]{2}(_[A-Z]{2})?$/

const inFlightBuilds = new Map<string, Promise<string>>()

/** Concurrent cache misses for one key share a single build. */
function singleFlight(
  key: string,
  run: () => Promise<string>,
): Promise<string> {
  const pending = inFlightBuilds.get(key)
  if (pending) {
    return pending
  }
  const promise = run().finally(() => inFlightBuilds.delete(key))
  inFlightBuilds.set(key, promise)
  return promise
}

/**
 * Sends the JSON built by `build`, serving it from Redis when a fresh copy
 * exists. Only for responses that are identical for every viewer. Responds 400
 * to a malformed `language` and 500 when `build` fails.
 */
export async function sendCachedJson(
  res: Response,
  endpoint: string,
  language: unknown,
  build: (language: string | undefined) => Promise<unknown>,
  logger: Logger,
): Promise<Response> {
  if (
    language !== undefined &&
    (typeof language !== "string" || !LANGUAGE_PATTERN.test(language))
  ) {
    return res.status(400).json({ message: "Invalid language" })
  }

  const client = redisClient()
  let key: string | undefined

  if (client?.isReady) {
    try {
      const version =
        (await withCacheTimeout(() => client.get(PUBLIC_CACHE_VERSION_KEY))) ??
        "0"
      const versionedKey = `${PUBLIC_CACHE_PREFIX}${version}:${endpoint}:${
        language ?? ""
      }`
      const cached = await withCacheTimeout(() => client.get(versionedKey))
      key = versionedKey
      if (cached) {
        return sendJson(res, cached)
      }
    } catch (e) {
      logger.warn(`Public API cache read failed for ${endpoint}: ${e}`)
    }
  }

  let body: string
  try {
    body = await singleFlight(
      key ?? `${endpoint}:${language ?? ""}`,
      async () => {
        const built = JSON.stringify(await build(language))
        if (client?.isReady && key) {
          const cacheKey = key
          withCacheTimeout(() =>
            client.set(cacheKey, built, { EX: PUBLIC_CACHE_TTL_SECONDS }),
          ).catch((e) =>
            logger.warn(`Public API cache write failed for ${key}: ${e}`),
          )
        }
        return built
      },
    )
  } catch (e) {
    logger.error(`Public API ${endpoint} failed: ${e}`)
    return res.status(500).json({ message: "Internal server error" })
  }

  return sendJson(res, body)
}

function sendJson(res: Response, body: string) {
  return res
    .status(200)
    .type("json")
    .setHeader(
      "Cache-Control",
      `public, max-age=${BROWSER_MAX_AGE_SECONDS}, stale-while-revalidate=${PUBLIC_CACHE_TTL_SECONDS}`,
    )
    .send(body)
}

/** Makes every cached public API response stale; call after any data change. */
export async function invalidatePublicApiCache(logger?: Logger) {
  const client = redisClient()
  if (!client?.isReady) {
    return
  }

  try {
    await withCacheTimeout(() => client.incr(PUBLIC_CACHE_VERSION_KEY))
  } catch (e) {
    logger?.warn(`Failed to invalidate public API cache: ${e}`)
  }
}
