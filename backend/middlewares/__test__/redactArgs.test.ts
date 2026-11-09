import { redactArgs } from "../redactArgs"

describe("redactArgs", () => {
  it("redacts sensitive keys at any depth", () => {
    const args = Object.assign(Object.create(null), {
      organization_secret: "s1",
      input: {
        personal_unique_code: "c1",
        nested: [{ password: "p1", Token: "t1", name: "kept" }],
        secret_key: "k1",
      },
      id: 1,
    })

    expect(redactArgs(args)).toEqual({
      organization_secret: "[REDACTED]",
      input: {
        personal_unique_code: "[REDACTED]",
        nested: [{ password: "[REDACTED]", Token: "[REDACTED]", name: "kept" }],
        secret_key: "[REDACTED]",
      },
      id: 1,
    })
  })

  it("does not modify the original args", () => {
    const args = { password: "p1" }

    redactArgs(args)

    expect(args).toEqual({ password: "p1" })
  })
})
