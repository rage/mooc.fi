const inFlight = new Map<string, Promise<unknown>>()

/**
 * Runs `run` unless a call for `key` is already in flight, in which case its promise is shared.
 *
 * Keys are process-wide, so prefix them with the caller's own namespace.
 */
export function singleFlight<T>(
  key: string,
  run: () => Promise<T>,
): Promise<T> {
  const pending = inFlight.get(key)
  if (pending) {
    return pending as Promise<T>
  }
  const promise = run().finally(() => inFlight.delete(key))
  inFlight.set(key, promise)
  return promise
}
