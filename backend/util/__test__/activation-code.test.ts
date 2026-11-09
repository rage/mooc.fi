import {
  generateActivationCode,
  isActivationCodeMatch,
} from "../activation-code"

describe("generateActivationCode", () => {
  it("generates varying 6-digit codes", () => {
    const codes = Array.from({ length: 50 }, generateActivationCode)

    for (const code of codes) {
      expect(code).toMatch(/^\d{6}$/)
    }
    expect(new Set(codes).size).toBeGreaterThan(1)
  })
})

describe("isActivationCodeMatch", () => {
  it("matches only the identical code", () => {
    expect(isActivationCodeMatch("012345", "012345")).toBe(true)
    expect(isActivationCodeMatch("012345", "12345")).toBe(false)
    expect(isActivationCodeMatch("012345", "012346")).toBe(false)
    expect(isActivationCodeMatch("012345", "0123456")).toBe(false)
  })

  it("never matches when no code is stored", () => {
    expect(isActivationCodeMatch(null, "")).toBe(false)
    expect(isActivationCodeMatch(undefined, "")).toBe(false)
    expect(isActivationCodeMatch("", "")).toBe(false)
  })
})
