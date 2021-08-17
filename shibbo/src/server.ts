import express, { CookieOptions } from "express"
import cors from "cors"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"
import {
  PORT,
  BACKEND_URL,
  FRONTEND_URL,
  SHIBBOLETH_HEADERS,
  defaultHeaders,
  DOMAIN,
} from "./config"
import { connectHandler, signInHandler, signUpHandler } from "./handlers"

const isProduction = process.env.NODE_ENV === "production"

if (isProduction && (!BACKEND_URL || !FRONTEND_URL)) {
  throw new Error("BACKEND_URL and FRONTEND_URL must be set")
}

const app = express()

app.set("port", PORT)
app.use(cors())
app.use(express.json())
app.use((req, _, next) => {
  if (!isProduction && !req.headers.schacpersonaluniquecode) {
    req.headers = { ...req.headers, ...defaultHeaders }
  }

  next()
})
app.use((_, res, next) => {
  res.setMOOCCookies = (
    data: Record<string, any>,
    headers: CookieOptions = { domain: DOMAIN, path: "/" },
  ) => {
    Object.entries(data).forEach(([key, value]) =>
      res.cookie(key, value, headers),
    )
    return res
  }

  next()
})

app.use(shibbolethCharsetMiddleware(SHIBBOLETH_HEADERS as any))
app.use((req, res, next) => {
  const {
    headers: { cookie },
  } = req
  res.locals.cookie =
    cookie?.split(";").reduce((res, item) => {
      const data = item.trim().split("=")
      return { ...res, [data[0]]: data[1] }
    }, {}) ?? {}
  next()
})

app.get(/^\/connect\/(hy|haka)\/?$/, connectHandler)

app.get(/^\/sign-in\/(hy|haka)\/?$/, signInHandler)

app.get(/^\/sign-up\/(hy|haka)\/?$/, signUpHandler)

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
})

export default app
