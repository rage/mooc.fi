import pg from "pg"

/**
 * Makes knex/pg read `timestamp without time zone` columns as UTC, the zone Prisma writes them in.
 *
 * pg's default parser reads them as local time, which shifts them whenever TZ isn't UTC.
 * Process-wide; Prisma's adapter has its own parsers and is unaffected.
 */
export const parseTimestampsAsUtc = () => {
  const parseDefault = pg.types.getTypeParser(pg.types.builtins.TIMESTAMP)
  pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (value) => {
    const date = new Date(`${value.replace(" ", "T")}Z`)
    // infinity and BC dates
    return isNaN(date.getTime()) ? parseDefault(value) : date
  })
}
