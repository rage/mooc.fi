import pg from "pg"

import { parseTimestampsAsUtc } from "../pgTimestamps"

describe("parseTimestampsAsUtc", () => {
  const originalTZ = process.env.TZ

  afterEach(() => {
    process.env.TZ = originalTZ
  })

  it("reads timestamp without time zone as UTC regardless of TZ", () => {
    process.env.TZ = "Europe/Helsinki"
    parseTimestampsAsUtc()
    const parse = pg.types.getTypeParser(pg.types.builtins.TIMESTAMP)

    expect(parse("2020-01-05 09:54:55.711")).toEqual(
      new Date("2020-01-05T09:54:55.711Z"),
    )
    expect(parse("infinity")).toBe(Infinity)
  })
})
