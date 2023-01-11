process.on("unhandledRejection", (...args) => {
  console.log(JSON.stringify(args, undefined, 2))
})

const isProduction = process.env.NODE_ENV === "production"
const express = require("express")
const morgan = require("morgan")

const next = require("next")

const compression = require("compression")

const Redirects = require("./Redirects")
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
const port = process.env.PORT || 3000
const app = next({ dev: !isProduction })
const handle = app.getRequestHandler()

const DirectFrom = Redirects.redirects_list

const createMockBackend = require("./tests/mockBackend")

const main = async () => {
  try {
    await app.prepare()
  } catch (e) {
    console.error("Prepairing Next.js app failed", e)
    throw e
  }

  const server = express()
  server.use(morgan("combined"))
  server.use(compression())

  if (isProduction) {
    server.get(/^\/static\/fonts\//, (_, res, next) => {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
      next()
    })
  }

  const redirectHandler = (req, res) => {
    const redirectNeeded = DirectFrom.find(
      (redirect) => redirect.from === req.url,
    )
    if (redirectNeeded) {
      res.redirect(redirectNeeded.to)
    }

    return handle(req, res)
  }

  server.get("*", redirectHandler)

  await server.listen(port)
  console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line no-console
}

const main2 = async () => {
  try {
    await main()
  } catch (e) {
    console.error("Server crashed :(", e)
  }
}

main2()
