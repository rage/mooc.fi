process.on("unhandledRejection", (...args) => {
  console.log(JSON.stringify(args, undefined, 2))
})

const express = require("express")

const next = require("next")

const compression = require("compression")

const Redirects = require("./Redirects")
const port = process.env.PORT || 3000
const app = next({ dev: process.env.NODE_ENV !== "production" })
const handle = app.getRequestHandler()

const DirectFrom = Redirects.redirects_list

const main = async () => {
  try {
    await app.prepare()
  } catch (e) {
    console.error("Prepairing Next.js app failed", e)
    throw e
  }

  const server = express()
  server.use(compression())

  /*   server.use((req, res, next) => {
    const urlLanguagePath = req.originalUrl.split("/")[1]
    //if it is a request to _next or /static/, do nothing
    if (urlLanguagePath === "_next" || urlLanguagePath === "static") {
    } else {
      if (urlLanguagePath === "se" || urlLanguagePath === "en") {
        req.language = urlLanguagePath
        if (req.i18n) {
          req.i18n.changeLanguage(urlLanguagePath)
        }
      } else {
        req.language = "fi"
        if (req.i18n) {
          req.i18n.changeLanguage("fi")
        }
      }
    }
    next()
  }) */

  server.get("/register-completion/:slug", (req, res) => {
    const actualPage = "/register-completion"
    const queryParams = { slug: req.params.slug }
    return app.render(req, res, actualPage, queryParams)
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
}

const main2 = async () => {
  try {
    await main()
  } catch (e) {
    console.error("Server crashed :(", e)
  }
}

main2()
