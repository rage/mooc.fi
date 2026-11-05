import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  hasRegisteredEquivalent,
  normalizeGrade,
} from "./creditRegistrationDelegation"

const earlier = {
  id: "earlier",
  completion_date: "2024-06-01T12:00:00Z",
  grade: "Hyväksytty",
  tier: null,
  registered: true,
}
const later = {
  id: "later",
  completion_date: "2025-03-01T12:00:00Z",
  grade: null,
  tier: null,
  registered: false,
}

describe("hasRegisteredEquivalent", () => {
  it("blocks a later completion with the same grade and tier", () => {
    assert.equal(hasRegisteredEquivalent(later, [earlier, later]), true)
  })

  it("lets a different grade through as an improvement", () => {
    assert.equal(
      hasRegisteredEquivalent({ ...later, grade: "5" }, [
        { ...earlier, grade: "3" },
        later,
      ]),
      false,
    )
  })

  it("lets a different tier through", () => {
    assert.equal(
      hasRegisteredEquivalent({ ...later, tier: 2 }, [earlier, later]),
      false,
    )
  })

  it("ignores an earlier completion that is not registered", () => {
    assert.equal(
      hasRegisteredEquivalent(later, [{ ...earlier, registered: false }]),
      false,
    )
  })

  it("ignores a registered completion that is newer", () => {
    assert.equal(
      hasRegisteredEquivalent({ ...earlier, registered: false }, [
        { ...later, registered: true },
      ]),
      false,
    )
  })

  it("never blocks a completion that is registered itself", () => {
    assert.equal(
      hasRegisteredEquivalent({ ...later, registered: true }, [earlier]),
      false,
    )
  })
})

describe("normalizeGrade", () => {
  it("reads grades as courses.mooc.fi does", () => {
    assert.equal(normalizeGrade(null), "pass")
    assert.equal(normalizeGrade(" Hyväksytty "), "pass")
    assert.equal(normalizeGrade("FAILED"), "fail")
    assert.equal(normalizeGrade("0"), "fail")
    assert.equal(normalizeGrade("4,0"), "4")
    assert.equal(normalizeGrade("5.0"), "5")
    assert.equal(normalizeGrade("4.5"), null)
    assert.equal(normalizeGrade("6"), null)
    assert.equal(normalizeGrade("excellent"), null)
  })
})
