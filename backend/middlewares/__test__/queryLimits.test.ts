import { readdirSync, readFileSync } from "fs"
import path from "path"

import axios from "axios"
import { buildSchema, parse, validate } from "graphql"

import { getTestContext } from "../../tests"
import {
  createQueryLimitsRule,
  MAX_QUERY_ALIASES,
  MAX_QUERY_DEPTH,
} from "../queryLimits"

const ctx = getTestContext()

const nestedCoursesQuery = (depth: number) => {
  let selection = "id"
  for (let level = depth - 1; level > 1; level--) {
    selection =
      level % 2 === 0
        ? `study_modules { ${selection} }`
        : `courses { ${selection} }`
  }
  return `{ courses { ${selection} } }`
}

const aliasedQuery = (aliases: number) =>
  `{ ${Array.from({ length: aliases }, (_, i) => `c${i}: courses { id }`).join(" ")} }`

const postQuery = (query: string) =>
  axios.post(
    `http://localhost:${ctx.port}/`,
    { query },
    {
      headers: { "Apollo-Require-Preflight": "true" },
      validateStatus: () => true,
    },
  )

describe("query limits", () => {
  describe("rule", () => {
    const schema = buildSchema("type Query { a: Int }")
    const errorsOf = (query: string, limits = {}) =>
      validate(schema, parse(query), [createQueryLimitsRule(limits)]).map(
        (error) => error.message,
      )

    it("counts depth through fragments and ignores introspection fields", () => {
      const query = `
        query { a { ...F } }
        fragment F on X { b { ... on Y { c { __typename __schema { types { name } } } } } }
      `

      expect(errorsOf(query, { maxDepth: 3 })).toEqual([])
      expect(errorsOf(query, { maxDepth: 2 })).toEqual([
        "Query depth 3 exceeds the maximum of 2",
      ])
    })

    it("counts aliases inside fragments", () => {
      const query = `
        query { x: a { ...F } }
        fragment F on X { y: b z: c }
      `

      expect(errorsOf(query, { maxAliases: 3 })).toEqual([])
      expect(errorsOf(query, { maxAliases: 2 })).toEqual([
        "Query uses 3 aliases, exceeding the maximum of 2",
      ])
    })

    it("terminates on fragment cycles and fragment fan-out", () => {
      const fanOut = Array.from(
        { length: 40 },
        (_, i) => `fragment F${i} on X { a { ...F${i + 1} ...F${i + 1} } }`,
      ).join("\n")

      expect(
        errorsOf(`
          query { ...A ...F0 }
          fragment A on X { a { ...B } }
          fragment B on X { b { ...A } }
          ${fanOut}
          fragment F40 on X { a }
        `),
      ).toEqual(["Query depth 41 exceeds the maximum of 15"])
    })

    it("passes every frontend operation", () => {
      const graphqlDir = path.join(__dirname, "../../../frontend/graphql")
      const documents = readdirSync(graphqlDir, { recursive: true })
        .map(String)
        .filter((file) => file.endsWith(".graphql"))
        .map((file) => readFileSync(path.join(graphqlDir, file), "utf8"))

      expect(documents.length).toBeGreaterThan(0)
      expect(errorsOf(documents.join("\n"))).toEqual([])
    })
  })

  describe("server", () => {
    it("serves a query at the depth and alias limits", async () => {
      for (const query of [
        nestedCoursesQuery(MAX_QUERY_DEPTH),
        aliasedQuery(MAX_QUERY_ALIASES),
      ]) {
        const res = await postQuery(query)

        expect(res.data.errors).toBeUndefined()
        expect(res.status).toBe(200)
      }
    })

    it("rejects a too deep query", async () => {
      const res = await postQuery(nestedCoursesQuery(MAX_QUERY_DEPTH + 1))

      expect(res.status).toBe(400)
      expect(res.data.errors[0]).toMatchObject({
        message: `Query depth ${MAX_QUERY_DEPTH + 1} exceeds the maximum of ${MAX_QUERY_DEPTH}`,
        extensions: { code: "GRAPHQL_VALIDATION_FAILED" },
      })
    })

    it("rejects a query with too many aliases", async () => {
      const res = await postQuery(aliasedQuery(MAX_QUERY_ALIASES + 1))

      expect(res.status).toBe(400)
      expect(res.data.errors[0]).toMatchObject({
        message: `Query uses ${MAX_QUERY_ALIASES + 1} aliases, exceeding the maximum of ${MAX_QUERY_ALIASES}`,
        extensions: { code: "GRAPHQL_VALIDATION_FAILED" },
      })
    })
  })
})
