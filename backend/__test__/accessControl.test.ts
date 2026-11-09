import { and, not, or } from "../accessControl"

type AuthorizeFunction = Parameters<typeof or>[number]

const pass: AuthorizeFunction = async () => true
const fail: AuthorizeFunction = async () => false
const error: AuthorizeFunction = async () => new Error("broken")

const run = (fn: AuthorizeFunction) => fn({}, {}, {} as any, {} as any)

describe("accessControl combinators", () => {
  describe("or", () => {
    it("fails when every async predicate fails", async () => {
      expect(await run(or(fail, fail))).toBe(false)
    })

    it("passes when any async predicate passes", async () => {
      expect(await run(or(fail, pass))).toBe(true)
    })

    it("treats an Error result as a failure", async () => {
      expect(await run(or(error))).toBe(false)
    })

    it("stops at the first passing predicate", async () => {
      const second = jest.fn(pass)
      expect(await run(or(pass, second))).toBe(true)
      expect(second).not.toHaveBeenCalled()
    })
  })

  describe("and", () => {
    it("passes when every async predicate passes", async () => {
      expect(await run(and(pass, pass))).toBe(true)
    })

    it("fails when any async predicate fails", async () => {
      expect(await run(and(pass, fail))).toBe(false)
    })

    it("treats an Error result as a failure", async () => {
      expect(await run(and(pass, error))).toBe(false)
    })

    it("stops at the first failing predicate", async () => {
      const second = jest.fn(pass)
      expect(await run(and(fail, second))).toBe(false)
      expect(second).not.toHaveBeenCalled()
    })
  })

  describe("not", () => {
    it("negates an async predicate", async () => {
      expect(await run(not(pass))).toBe(false)
      expect(await run(not(fail))).toBe(true)
    })

    it("fails on an Error result", async () => {
      expect(await run(not(error))).toBe(false)
    })
  })
})
