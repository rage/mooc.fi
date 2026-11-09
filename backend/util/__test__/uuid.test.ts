import { normalizeUuid } from "../uuid"

describe("normalizeUuid", () => {
  it("treats hyphenated, unhyphenated and uppercase forms as equal", () => {
    expect(normalizeUuid("5F2B6A4C-1D3E-4F5A-8B9C-0D1E2F3A4B5C")).toBe(
      normalizeUuid("5f2b6a4c1d3e4f5a8b9c0d1e2f3a4b5c"),
    )
  })
})
