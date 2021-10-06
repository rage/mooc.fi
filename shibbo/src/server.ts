import cors from "cors"
import express, {
  CookieOptions,
  RequestHandler,
  urlencoded,
} from "express"
import * as fs from "fs"
import morgan from "morgan"
import passport, { AuthenticateOptions } from "passport"
import { MultiSamlStrategy } from "passport-saml"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"

import {
  BACKEND_URL,
  DOMAIN,
  FRONTEND_URL,
  PORT,
  SHIBBOLETH_HEADERS,
} from "./config"
import {
  connectHandler,
  signInHandler,
  signUpHandler,
} from "./handlers"
import { HandlerCallback } from "./types/handlers"
import {
  decodeRelayState,
  encodeRelayState,
} from "./util/relayState"

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

/*const connectHandler: RequestHandler = (req, res, next) => {
  const relayState = encodeRelayState(req)

  passport.authenticate(
    "multi",
    {
      additionalParams: {
        RelayState: relayState
      },
    } as AuthenticateOptions,
    (err, user) => {
      console.log("connect handler", err, user, req.query)

      req.login(user, (err) => {
        if (err) {
          console.log("connect error", err)
        }
      })

      const { provider, action } = req.params
      const { language = "en" } = req.query

      res.redirect(`/foo?${Object.entries({ provider, action, language }).map(([key, value]) => `${key}=${value}`).join("&")}`)
    },
  )(req, res, next)
}*/

const handlers: Record<string, HandlerCallback> = {
  "sign-in": signInHandler,
  "sign-up": signUpHandler,
  connect: connectHandler,
}

const providers: Record<string, string> = {
  hy: "http://localhost:7000/saml/sso",
  haka: "http://localhost:7002/saml/sso",
}

const callbackHandler: RequestHandler = (req, res, next) => {
  const relayState = req.params.RelayState || req.body.RelayState
  const action = req.params.action || decodeRelayState(relayState)?.action

  const decodedRelayState = decodeRelayState(
    req.params.RelayState || req.body.RelayState,
  ) ?? {
    action: req.params.action,
    provider: req.params.provider,
    language: ((req.query.language || req.params.language) as string) ?? "en",
  }
  console.log("callback relaystate", decodedRelayState)

  if (!Object.keys(handlers).includes(action)) {
    throw new Error(`unknown action ${action}`) // TODO: something more sensible
  }

  passport.authenticate(
    "hy-haka",
    {
      additionalParams: {
        RelayState: relayState
      }
    } as AuthenticateOptions,
    handlers[action](req, res, next)
  )(req, res, next)
}

/*passport.serializeUser((user, done) => {
  console.log("serialize", user)
  done(null, user)
})
passport.deserializeUser((user, done) => {
  console.log("deserialize", user)

  done(null, user as any)
})*/

passport.use(
  "hy-haka",
  new MultiSamlStrategy(
    {
      passReqToCallback: true,
      getSamlOptions(req, done) {
        const relayState = encodeRelayState(req)
        const { provider, action } = req.params
        const language = req.query.language || req.params.language || "en"

        done(null, {
          name: "multi",
          path: `/callbacks/${provider}/${action}/${language}`,
          entryPoint: providers[provider],
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
            RelayState: relayState,
          },
        })
      },
    },
    (_req, profile: any, done) => {
      console.log("got profile", profile)
      done(
        null,
        Object.entries(profile?.attributes).reduce(
          (acc, [key, value]) => ({ ...acc, [key.toLowerCase()]: value }),
          {},
        ) ?? undefined,
      )
    },
  ),
)

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

/*app.get(/^\/connect\/(hy|haka)\/?$/, connectHandler)

app.get(/^\/sign-in\/(hy|haka)\/?$/, signInHandler)

app.get(/^\/sign-up\/(hy|haka)\/?$/, signUpHandler)*/

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
})

export default app
