import cors from "cors"
import express, {
  CookieOptions,
  urlencoded,
} from "express"
import morgan from "morgan"
import passport from "passport"
import { MultiSamlStrategy } from "passport-saml"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"

import {
  DOMAIN,
  HAKA_IDP_URL,
  HY_IDP_URL,
  MOOCFI_CERTIFICATE,
  PORT,
  SHIBBOLETH_HEADERS,
} from "./config"
import { callbackHandler } from "./handlers"
import {
  convertObjectKeysToLowerCase,
  encodeRelayState,
} from "./util"

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


const providers: Record<string, string> = {
  hy: HY_IDP_URL,
  haka: HAKA_IDP_URL,
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
          cert: MOOCFI_CERTIFICATE,
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
        convertObjectKeysToLowerCase(profile?.attributes)
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
