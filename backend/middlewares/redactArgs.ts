const SENSITIVE_ARG_KEYS = new Set([
  "organization_secret",
  "personal_unique_code",
  "secret_key",
  "password",
  "token",
])

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null) {
    return false
  }
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

/**
 * Copies resolver args for logging, replacing values of sensitive keys at any depth.
 *
 * Non-plain objects (uploads, dates) are kept by reference, not copied.
 */
export const redactArgs = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(redactArgs)
  }
  if (!isPlainObject(value)) {
    return value
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [
      key,
      SENSITIVE_ARG_KEYS.has(key.toLowerCase())
        ? "[REDACTED]"
        : redactArgs(nested),
    ]),
  )
}
