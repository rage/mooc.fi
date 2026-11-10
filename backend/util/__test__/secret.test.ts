import { isSecretMatch } from "../secret"

describe("isSecretMatch", () => {
  it("matches only the identical secret", () => {
    expect(isSecretMatch("012345", "012345")).toBe(true)
    expect(isSecretMatch("012345", "12345")).toBe(false)
    expect(isSecretMatch("012345", "012346")).toBe(false)
    expect(isSecretMatch("012345", "0123456")).toBe(false)
  })

  it("never matches when no secret is stored", () => {
    expect(isSecretMatch(null, "")).toBe(false)
    expect(isSecretMatch(undefined, "")).toBe(false)
    expect(isSecretMatch("", "")).toBe(false)
  })
})
