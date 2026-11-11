import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  findDelegatedCompletion,
  hasRegisteredEquivalent,
  normalizeGrade,
  pickRegistrableCompletion,
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

const course = { credit_registration_delegated_at: "2025-01-01T00:00:00Z" }
const beforeCutoff = {
  ...earlier,
  id: "before",
  registered: false,
  eligible_for_ects: true,
  course,
}
const afterCutoff = { ...later, id: "after", eligible_for_ects: true, course }

describe("findDelegatedCompletion", () => {
  it("finds an eligible completion dated after the cutoff", () => {
    assert.equal(
      findDelegatedCompletion([beforeCutoff, afterCutoff]),
      afterCutoff,
    )
  })

  it("skips one that is registered already", () => {
    assert.equal(
      findDelegatedCompletion([{ ...afterCutoff, registered: true }]),
      undefined,
    )
  })
})

describe("pickRegistrableCompletion", () => {
  it("leaves out an unregistered completion dated after the cutoff", () => {
    assert.equal(
      pickRegistrableCompletion([beforeCutoff, afterCutoff]),
      beforeCutoff,
    )
  })

  it("picks a registered completion dated after the cutoff", () => {
    const registered = { ...afterCutoff, registered: true }
    assert.equal(pickRegistrableCompletion([registered]), registered)
  })
})
