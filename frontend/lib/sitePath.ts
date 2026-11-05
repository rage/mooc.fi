/**
 * The path as the browser would follow it, when it stays on this site; otherwise null.
 *
 * Browsers drop tabs and newlines from URLs, so `/\t/evil.example` leads off-site.
 */
export const toSitePath = (path: unknown): string | null => {
  if (typeof path !== "string") {
    return null
  }
  const followed = path.replace(/[\t\r\n]/g, "")
  return /^\/(?![/\\])/.test(followed) ? followed : null
}
