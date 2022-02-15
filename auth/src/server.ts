import cors from "cors"
import express, { CookieOptions, Express } from "express"
import { Server } from "http"
import morgan from "morgan"
import passport from "passport"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"
import * as winston from "winston"

import {
  DOMAIN,
  isProduction,
  isTest,
  PORT,
  SHIBBOLETH_HEADERS,
} from "./config"
import { handlers } from "./handlers"
import { createRouter, HakaStrategy, HyStrategy } from "./saml"
import { setLocalCookiesMiddleware } from "./util"

global.debug = {} as typeof console
if (process.env.NODE_ENV !== "production") {
  Object.setPrototypeOf(debug, console)
}

export default async function createApp(): Promise<{
  app: Express
  server: Server
}> {
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
  winston

  app.use(shibbolethCharsetMiddleware(SHIBBOLETH_HEADERS as any))
  app.use(setLocalCookiesMiddleware)
  app.use(passport.initialize())

  if (!isTest) {
    const hyStrategy = (await HyStrategy.initialize()).instance
    const hakaStrategy = (await HakaStrategy.initialize()).instance

    passport.use("hy", hyStrategy)
    passport.use("haka", hakaStrategy)

    const hyRouter = createRouter({
      strategyName: "hy",
      strategy: hyStrategy,
      handlers,
    })
    const hakaRouter = createRouter({
      strategyName: "haka",
      strategy: hakaStrategy,
      handlers,
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

  const server = app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
  })

  return { app, server }
}

if (!isTest) {
  createApp()
}
