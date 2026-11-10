/**
 * Canonical form of a uuid for comparing ids: lowercase without dashes.
 * Ids from client args may be unhyphenated or uppercase, which Postgres accepts.
 */
export const normalizeUuid = (id: string) =>
  id.replaceAll("-", "").toLowerCase()
