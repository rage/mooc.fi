process.on("unhandledRejection", (...args) => {
  console.log(JSON.stringify(args, undefined, 2))
})

const isProduction = process.env.NODE_ENV === "production"
const express = require("express")

const next = require("next")

const compression = require("compression")

const Redirects = require("./Redirects")
const port = process.env.PORT || 3000
const app = next({ dev: !isProduction })
const handle = app.getRequestHandler()

const DirectFrom = Redirects.redirects_list

const { buildSchema } = require("graphql")
const graphqlHTTP = require("express-graphql")
const bodyParser = require("body-parser")
const cors = require("cors")

const cypress = process.env.CYPRESS === "true"
const fs = require("fs")
const path = require("path")

const main = async () => {
  try {
    await app.prepare()
  } catch (e) {
    console.error("Prepairing Next.js app failed", e)
    throw e
  }

  const server = express()
  server.use(compression())

  if (isProduction) {
    server.get(/^\/static\/fonts\//, (_, res, next) => {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
      next()
    })
  }

  const mockCookies = {}
  let mockLogout = false

  server.get("*", (req, res) => {
    if (cypress && (mockLogout || Object.keys(mockCookies).length)) {
      // add mockCookies to current cookie, or remove login details if logging out
      const { cookie } = req.headers
      const currentCookies = cookie
        ? cookie.split("; ").reduce((acc, curr) => {
            const [key, val] = curr.split("=")

            if (mockLogout && ["access_token", "admin"].indexOf(key) >= 0) {
              return acc
            }

            return {
              ...acc,
              [key]: val,
            }
          }, {})
        : {}

      const newCookies = { ...currentCookies, ...mockCookies }
      const cookieString = Object.keys(newCookies)
        .map(k => `${k}=${newCookies[k]}`)
        .join("; ")
      req.headers.cookie = cookieString

      mockLogout = false
    }

    const redirectNeeded = DirectFrom.find(
      redirect => redirect.from === req.url,
    )
    if (redirectNeeded) {
      res.redirect(redirectNeeded.to)
    }

    return handle(req, res)
  })

  await server.listen(port)
  console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line no-console

  if (cypress) {
    const mockBackend = express()
    mockBackend.use(bodyParser.json())
    mockBackend.use(cors({ origin: "http://localhost:3000" }))

    const schemaCode = fs.readFileSync(
      path.resolve(__dirname, "./schema.graphql"),
      "utf8",
    )
    const schema = buildSchema(schemaCode)
    const resolver = {}
    const results = {}

    /* 
      POST to /mock in format 
        { 
          query: "QUERY_NAME", 
          variables?: { var1: "asdf", ... }
          result: "QUERY_RESULT" 
        }
      - creates (or replaces) a resolver for said query returning result
      - if no variables specified, query return same result irregardless of arguments it gets
    */

    const sortObj = o =>
      Object.keys(o)
        .sort()
        .reduce((acc, curr) => ({ ...acc, [curr]: o[curr] }), {})
    const getKey = (query, variables) =>
      `${query}#${JSON.stringify(sortObj(variables))}`

    mockBackend.post("/mock", (req, res) => {
      const { query, variables, result } = req.body

      if (variables) {
        results[getKey(query, variables)] = result
      }

      resolver[query] = (_, args) =>
        args ? results[getKey(query, args)] || result : result

      res.json(result)
    })

    mockBackend.delete("/mock", (req, res) => {
      Object.keys(resolver).forEach(k => delete resolver[k])
      Object.keys(results).forEach(k => delete results[k])

      res.json({ ok: true })
    })

    mockBackend.post("/signin", (req, res) => {
      const { details, accessToken } = req.body

      mockCookies.access_token = accessToken
      mockCookies.admin = details.administrator

      res.json(details)
    })

    mockBackend.post("/signout", (req, res) => {
      delete mockCookies.access_token
      delete mockCookies.admin

      mockLogout = true

      res.json({})
    })

    mockBackend.use("/", (req, res) => {
      graphqlHTTP({
        schema,
        rootValue: resolver,
        context: { schemaCode },
        graphiql: true,
      })(req, res)
    })

    await mockBackend.listen(4001)
    console.log("> Mock backend ready on http://localhost:4001")
  }
}

const main2 = async () => {
  try {
    await main()
  } catch (e) {
    console.error("Server crashed :(", e)
  }
}

main2()
