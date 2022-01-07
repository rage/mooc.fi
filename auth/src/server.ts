import cors from "cors"
import express, { CookieOptions } from "express"
import morgan from "morgan"
import passport from "passport"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"

import { DOMAIN, PORT, SHIBBOLETH_HEADERS } from "./config"
import { createRouter, HakaStrategy, HyStrategy } from "./saml"
import { TestStrategy } from "./saml/test"
import { setLocalCookiesMiddleware } from "./util"

const isProduction = process.env.NODE_ENV === "production"
const isTest = true || process.env.NODE_ENV === "test"

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

  const hyStrategy = (await HyStrategy.initialize()).instance
  const hakaStrategy = (await HakaStrategy.initialize()).instance

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

  if (isTest) {
    const testStrategyBuilder = await TestStrategy.initialize()
    const testStrategy = testStrategyBuilder.instance

    passport.use("test", testStrategy)

    const testRouter = createRouter({
      strategyName: "test",
      strategy: testStrategy,
    })
    app.use(testRouter)
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
