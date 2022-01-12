import cors from "cors"
import express, { CookieOptions, Router, urlencoded } from "express"
import morgan from "morgan"
import passport from "passport"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"

import {
  DOMAIN,
  isProduction,
  PASSPORT_STRATEGY,
  PORT,
  SHIBBOLETH_HEADERS,
  SP_PATH,
  USE_MULTISAML,
} from "./config"
import { createCallbackHandler, metadataHandler } from "./handlers/index"
import { getPassportConfig } from "./metadata"
import { metadataConfig } from "./metadata/config"
import { createSamlStrategy } from "./saml"
import { createRouter } from "./saml/common"
import { HakaStrategy } from "./saml/haka"
import { HyStrategy } from "./saml/hy"
import { setLocalCookiesMiddleware } from "./util"

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
    hy: await getPassportConfig(metadataConfig["hy"]),
    haka: await getPassportConfig(metadataConfig["haka"]),
  }

  if (USE_MULTISAML) {
    const strategy = createSamlStrategy(passportConfig)
    passport.use(PASSPORT_STRATEGY, strategy)

    const callbackHandler = createCallbackHandler()
    const router = Router()
      .get("/:action/:provider", callbackHandler)
      .post(
        "/callbacks/:provider",
        urlencoded({ extended: false }),
        callbackHandler,
      )
      .get("/:action/:provider/metadata", metadataHandler(strategy))

    app.use(SP_PATH, router)
  } else {
    const hyStrategy = new HyStrategy(passportConfig["hy"]).getStrategy()
    const hakaStrategy = new HakaStrategy(passportConfig["haka"]).getStrategy()

    passport.use("hy", hyStrategy)
    passport.use("haka", hakaStrategy)

    const hyRouter = createRouter({
      strategyName: "hy",
      strategy: hyStrategy,
    })
    const hakaRouter = createRouter({
      strategyName: "haka",
      strategy: hakaStrategy,
    })

    app.use(hyRouter)
    app.use(hakaRouter)
  }
  // not used?
  passport.serializeUser((user, done) => {
    console.log("serialize", user)
    return done(null, user)
  })
  passport.deserializeUser((user, done) => {
    console.log("deserialize", user)

    return done(null, user as any)
  })

  app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
  })

  return app
}

createApp()
