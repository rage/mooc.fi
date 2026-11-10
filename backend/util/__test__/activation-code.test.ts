import { generateActivationCode } from "../activation-code"

describe("generateActivationCode", () => {
  it("generates varying 6-digit codes", () => {
    const codes = Array.from({ length: 50 }, generateActivationCode)

    for (const code of codes) {
      expect(code).toMatch(/^\d{6}$/)
    }
    expect(new Set(codes).size).toBeGreaterThan(1)
  })
})
