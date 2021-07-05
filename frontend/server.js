process.on("unhandledRejection", (...args) => {
  console.log(JSON.stringify(args, undefined, 2))
})

const isProduction = process.env.NODE_ENV === "production"
const express = require("express")
const morgan = require("morgan")

const next = require("next")

const compression = require("compression")

const Redirects = require("./Redirects")
const port = process.env.PORT || 3000
const app = next({ dev: !isProduction })
const handle = app.getRequestHandler()

const DirectFrom = Redirects.redirects_list

const cypress = process.env.CYPRESS === "true"
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

  if (cypress) {
    const { redirectHandlerWithCookies } = await createMockBackend({
      redirectHandler,
    })
    server.get("*", redirectHandlerWithCookies)
  } else {
    server.get("*", redirectHandler)
  }

  server
    .listen(port)
    .on("listening", () => console.log(`> Ready on http://localhost:${port}`)) // eslint-disable-line no-console
    .on("error", (e) => console.log("error", e))
}

const main2 = async () => {
  try {
    await main()
  } catch (e) {
    console.error("Server crashed :(", e)
  }
}

main2()
