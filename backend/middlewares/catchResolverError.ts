import { plugin } from "nexus"

/**
 * Calls `resolve`, handing a synchronous throw or a rejection to `onError`,
 * whose return value (or throw) becomes the field's result. Adds no promise to
 * synchronous resolvers.
 */
export const catchResolverError = (
  resolve: () => unknown,
  onError: (error: unknown) => unknown,
) => {
  let result: unknown
  try {
    result = resolve()
  } catch (error) {
    return onError(error)
  }
  return plugin.completeValue(result, (value) => value, onError)
}
