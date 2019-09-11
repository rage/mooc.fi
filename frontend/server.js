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

  server.get("*", (req, res) => {
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

    /* 
      POST to /mock in format 
        { 
          query: "QUERY_NAME", 
          result: "QUERY_RESULT" 
        }
      creates (or replaces) a resolver for said query returning result
    */

    mockBackend.post("/mock", (req, res) => {
      resolver[req.body.query] = () => req.body.result

      res.json(req.body.result)
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
