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

  it("stays bounded for a huge search", () => {
    const search = Array.from({ length: 100_000 }, () => "word").join(" ")

    const start = Date.now()
    const conditions = buildUserSearch(search)
    const raw = buildUserSearchRaw(search)

    expect(Date.now() - start).toBeLessThan(1000)
    expect(conditions.length).toBeLessThanOrEqual(10)
    for (const condition of conditions) {
      expect(JSON.stringify(condition).length).toBeLessThan(200)
    }
    expect(raw?.values.length).toBeLessThanOrEqual(10)
  })
})
