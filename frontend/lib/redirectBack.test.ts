import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { isSafeRedirectPath } from "./redirectBack"

describe("isSafeRedirectPath", () => {
  it("accepts root-relative paths", () => {
    assert.equal(isSafeRedirectPath("/"), true)
    assert.equal(isSafeRedirectPath("/courses/foo?x=1#y"), true)
    assert.equal(isSafeRedirectPath("/en/profile/"), true)
  })

  it("rejects off-site and script URLs", () => {
    assert.equal(isSafeRedirectPath("javascript:alert(1)"), false)
    assert.equal(isSafeRedirectPath("https://evil.example"), false)
    assert.equal(isSafeRedirectPath("//evil.example"), false)
    assert.equal(isSafeRedirectPath("/\\evil.example"), false)
    assert.equal(isSafeRedirectPath("/\t/evil.example"), false)
    assert.equal(isSafeRedirectPath("/\n/evil.example"), false)
    assert.equal(isSafeRedirectPath("courses"), false)
    assert.equal(isSafeRedirectPath(""), false)
  })

  it("rejects non-strings", () => {
    assert.equal(isSafeRedirectPath(undefined), false)
    assert.equal(isSafeRedirectPath(null), false)
    assert.equal(isSafeRedirectPath({ pathname: "/" }), false)
  })
})
