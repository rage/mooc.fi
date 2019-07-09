const express = require("express")
const next = require("next")
const nextI18NextMiddleware = require("next-i18next/middleware")
const compression = require("compression")
const nextI18next = require("./i18n")

const Redirects = require("./Redirects")
const port = process.env.PORT || 3000
const app = next({ dev: process.env.NODE_ENV !== "production" })
const handle = app.getRequestHandler()

const DirectFrom = Redirects.redirects_list

;(async () => {
  await app.prepare()
  const server = express()
  server.use(compression())
  server.use(nextI18NextMiddleware(nextI18next))

  server.get("/course/:id", (req, res) => {
    const actualPage = "/course"
    const queryParams = { course: req.params.id }
    return app.render(req, res, actualPage, queryParams)
  })

  server.get("/register-completion/:slug", (req, res) => {
    const actualPage = "/register-completion"
    const queryParams = { slug: req.params.slug }
    return app.render(req, res, actualPage, queryParams)
  })

  server.get("/my-profile", (req, res) => {
    const actualPage = "/my-profile"
    return app.render(req, res, actualPage)
  })

  server.get("/my-profile/completions", (req, res) => {
    const actualPage = "/completions"

    return app.render(req, res, actualPage)
  })

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
})()
