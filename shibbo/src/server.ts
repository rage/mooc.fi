import cors from "cors"
import express, {
  CookieOptions,
  RequestHandler,
  urlencoded,
} from "express"
import * as fs from "fs"
import morgan from "morgan"
import passport from "passport"
import { MultiSamlStrategy } from "passport-saml"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"

import {
  BACKEND_URL,
  DOMAIN,
  FRONTEND_URL,
  PORT,
  SHIBBOLETH_HEADERS,
} from "./config"

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
app.use(passport.initialize())

const loginHandler: RequestHandler = (req, res, next) => {
  passport.authenticate(
    "multi",
    {
      // @ts-ignore: it says it doesn't have this in type
      additionalParams: { language: (req.query.language as string) ?? "en" },
    },
    (err, user) => {
      console.log("login handler", err, user)

      req.login(user, (err) => {
        if (err) {
          console.log("login error", err)
        }
      })
      res.redirect(req.body.RelayState || req.query.RelayState || "/foo")
    },
  )(req, res, next)
}

passport.serializeUser((user, done) => {
  console.log("serialize", user)
  done(null, user)
})
passport.deserializeUser((user, done) => {
  console.log("deserialize", user)

  done(null, user as any)
})

passport.use(
  "multi",
  new MultiSamlStrategy(
    {
      passReqToCallback: true,
      getSamlOptions(req, done) {
        console.log("relaystate", req.query.relaystate || req.body.relaystate)
        done(null, {
          name: "multi",
          path: `/callbacks/hy`,
          entryPoint: "http://localhost:7000/saml/sso",
          issuer: "https://mooc.fi/sp",
          cert: fs
            .readFileSync(
              __dirname + "/../shibboleth-staging/certs/mooc.fi.crt",
            )
            .toString(),
          authnRequestBinding: "HTTP-POST",
          forceAuthn: true,
          identifierFormat:
            "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
          additionalParams: {
            language: (req.query.language as string) ?? "en",
          },
        })
      },
    },
    (_req, profile, done) => {
      console.log("got profile", profile)
      // gets profile, yup
      done(null, profile ?? undefined)
    },
  ),
)

// passport.use("hy", signInStrategy("hy"))
// passport.use("haka", signInStrategy("haka"))

app.get("/sign-in/:provider", loginHandler)
app.post("/callbacks/:provider", urlencoded({ extended: false }), loginHandler)
/*(req, res, next) => {
    console.log("callback first req headers", req.headers)
    console.log("callback first req body", req.body)

    passport.authenticate("multi", { failureRedirect: "/foo", failureFlash: true }, (err, user) => {
      console.log("authenticated with", err, user)

    })(req, res, next)
  },
  (req, res) => {
    console.log("callback req headers", req.headers)
    console.log("callback req body", req.body)

    return res.redirect("/foo")
  },
)*/

app.get("/foo", (req, res) => {
  console.log("foo req headers", req.headers)
  res.status(200)
  res.send("foo")
  res.end()
})

/*
app.get("/sign-in/:provider", 
  passport.authenticate("multi", { successRedirect: "/foo", failureRedirect: "/foo"}),
  (_req, res) => res.redirect("/foo")
)
app.all(("/sign-in/:provider"), (req, res, next) => {
  const language = req.query.language ?? "en"
  const provider = req.params.provider ?? ""

  console.log(req)
  if (!provider || Array.isArray(provider)) {
    next(new Error("illegal provider"))
  }

  if (req.method === "GET") {
    return passport.authenticate(provider as string, (err, user, _info) => {
      console.log("in here")
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.redirect(
          `${FRONTEND_URL}/${language !== "en" ? `${language}/` : ""}sign-in`,
        )
      }
      return res.redirect(
        `${FRONTEND_URL}/${language !== "en" ? `${language}/` : ""}`,
      )
    })(req, res, next)
  }

  return res.redirect("http://localhost:3000")
})
*/
/*app.get(/^\/connect\/(hy|haka)\/?$/, connectHandler)

app.get(/^\/sign-in\/(hy|haka)\/?$/, signInHandler)

app.get(/^\/sign-up\/(hy|haka)\/?$/, signUpHandler)*/

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
})

export default app
