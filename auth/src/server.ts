import cors from "cors"
import express, { CookieOptions, Router, urlencoded } from "express"
import morgan from "morgan"
import passport from "passport"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"

import {
  DOMAIN,
  PASSPORT_STRATEGY,
  PORT,
  SHIBBOLETH_HEADERS,
  SP_PATH,
} from "./config"
import { callbackHandler, metadataHandler } from "./handlers/index"
import { getPassportConfig } from "./metadata"
import { createSamlStrategy } from "./saml"
import { setLocalCookiesMiddleware } from "./util"

const isProduction = process.env.NODE_ENV === "production"

async function createApp() {
  const app = express()

  app.set("port", PORT)
  app.use(cors())
  app.use(express.json())
  app.use((req, _, next) => {
    if (!isProduction && !req.headers.edupersonprincipalname) {
      req.headers = { ...req.headers /*, ...defaultHeaders */ }
    }

    next()
  })
  app.use((_, res, next) => {
    res.setMOOCCookies = (
      data: Record<string, any>,
      headers?: CookieOptions,
    ) => {
      Object.entries(data).forEach(([key, value]) =>
        res.cookie(key, value, { domain: DOMAIN, path: "/", ...headers }),
      )
      return res
    }

    next()
  })
  app.use(morgan("combined"))

  app.use(shibbolethCharsetMiddleware(SHIBBOLETH_HEADERS as any))
  app.use(setLocalCookiesMiddleware)
  app.use(passport.initialize())

  const passportConfig = {
    hy: await getPassportConfig("hy"),
    haka: await getPassportConfig("haka"),
  }

  const strategy = createSamlStrategy(passportConfig)
  passport.use(PASSPORT_STRATEGY, strategy)

  // not used?
  /*passport.serializeUser((user, done) => {
  console.log("serialize", user)
  done(null, user)
})
passport.deserializeUser((user, done) => {
  console.log("deserialize", user)

  done(null, user as any)
})*/

  const router = Router()
    .get("/:action/:provider", callbackHandler)
    .post(
      "/callbacks/:provider",
      urlencoded({ extended: false }),
      callbackHandler,
    )
    .post(
      "/callbacks/:provider/:action/:language",
      urlencoded({ extended: false }),
      callbackHandler,
    )
    .get("/:action/:provider/metadata", metadataHandler(strategy))

  app.use(SP_PATH, router)
  app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
  })

  return app
}

createApp()
