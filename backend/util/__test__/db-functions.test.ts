import { buildUserSearch, buildUserSearchRaw } from "../db-functions"

describe("buildUserSearch", () => {
  it("builds name combinations for a multi-word search", () => {
    expect(buildUserSearch("first last", ["full_name"])).toEqual([
      {
        first_name: { contains: "first", mode: "insensitive" },
        last_name: { contains: "last", mode: "insensitive" },
      },
    ])
  })

  it("builds name combinations for a 6-part name", () => {
    expect(buildUserSearch("a b c d e f", ["full_name"])).toHaveLength(5)
    expect(buildUserSearchRaw("a b c d e f", ["full_name"])?.values).toEqual(
      expect.arrayContaining(["%a b c d e%", "%f%"]),
    )
  })

  it("stays bounded for a huge search", () => {
    const search = Array.from({ length: 100_000 }, () => "word").join(" ")

    const start = Date.now()
    const conditions = buildUserSearch(search)
    const raw = buildUserSearchRaw(search)

    expect(Date.now() - start).toBeLessThan(1000)
    expect(conditions.length).toBeLessThanOrEqual(30)
    for (const condition of conditions) {
      expect(JSON.stringify(condition).length).toBeLessThan(300)
    }
    expect(raw?.values.length).toBeLessThanOrEqual(60)
  })
})
