const CACHE_COMMAND_TIMEOUT_MS = 200
const CIRCUIT_OPEN_MS = 5000

let circuitOpenUntil = 0

export class CacheTimeoutError extends Error {
  constructor() {
    super(`Cache command timed out after ${CACHE_COMMAND_TIMEOUT_MS}ms`)
  }
}

/**
 * Runs a Redis cache command, rejecting if it takes over 200 ms. After a
 * timeout, commands fail fast for 5 s so a stalled Redis costs one wait, not
 * one per request. Callers must treat rejection as a cache miss.
 *
 * node-redis only aborts commands that are still unsent, so the race is
 * done here.
 */
export async function withCacheTimeout<T>(run: () => Promise<T>): Promise<T> {
  if (Date.now() < circuitOpenUntil) {
    throw new CacheTimeoutError()
  }

  let timer: NodeJS.Timeout | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      circuitOpenUntil = Date.now() + CIRCUIT_OPEN_MS
      reject(new CacheTimeoutError())
    }, CACHE_COMMAND_TIMEOUT_MS)
  })

  try {
    return await Promise.race([run(), timeout])
  } finally {
    clearTimeout(timer)
  }
}
