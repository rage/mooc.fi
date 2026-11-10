import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { escapeHtml } from "./escapeHtml"

describe("escapeHtml", () => {
  it("escapes markup and attribute delimiters", () => {
    assert.equal(
      escapeHtml(`<img src=x onerror="alert('&')">`),
      "&lt;img src=x onerror=&quot;alert(&#39;&amp;&#39;)&quot;&gt;",
    )
  })

  it("leaves plain text and email addresses unchanged", () => {
    assert.equal(
      escapeHtml("first.last+tag@example.com"),
      "first.last+tag@example.com",
    )
  })

  it("stringifies non-string values", () => {
    assert.equal(escapeHtml(3), "3")
  })
})
