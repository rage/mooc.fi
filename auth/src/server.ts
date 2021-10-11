import cors from "cors"
import express, {
  CookieOptions,
  urlencoded,
} from "express"
import morgan from "morgan"
import passport from "passport"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"

import {
  DOMAIN,
  PORT,
  SHIBBOLETH_HEADERS,
} from "./config"
import { callbackHandler } from "./handlers"
import { createSamlStrategy } from "./saml"
import { setLocalCookiesMiddleware } from "./util"

const isProduction = process.env.NODE_ENV === "production"

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
  res.setMOOCCookies = (data: Record<string, any>, headers?: CookieOptions) => {
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


passport.use(
  "hy-haka",
  createSamlStrategy()
)

// not used?
/*passport.serializeUser((user, done) => {
  console.log("serialize", user)
  done(null, user)
})
passport.deserializeUser((user, done) => {
  console.log("deserialize", user)

  done(null, user as any)
})*/


app.get("/:action/:provider", callbackHandler)

app.post(
  "/callbacks/:provider",
  urlencoded({ extended: false }),
  callbackHandler,
)
app.post(
  "/callbacks/:provider/:action/:language",
  urlencoded({ extended: false }),
  callbackHandler,
)

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
})

export default app
