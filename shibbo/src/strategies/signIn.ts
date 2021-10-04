import axios from "axios"
import * as fs from "fs"
import { Strategy as SamlStrategy } from "passport-saml"

import { AUTH_URL } from "../config"

const grant_type = "client_authorize"
const response_type = "token"
const client_secret = "native"

const isNullOrUndefined = <T>(
  value: T | null | undefined,
): value is null | undefined => !Boolean(value)

const signInStrategy = (provider: string) => new SamlStrategy(
  {
    path: `/sign-in/${provider}`,
    entryPoint: "http://localhost:7000/saml/sso",
    issuer: "urn:example:idp",
    cert: fs
      .readFileSync(__dirname + "/../../shibboleth-staging/certs/mooc.fi.crt")
      .toString(),
  },
  async (_req, profile, done) => {
    console.log("in strategy", _req, profile)
    if (isNullOrUndefined(profile)) {
      return done(null)
    }

    const { schacpersonaluniquecode } = profile

    try {
      const { data } = await axios.post(`${AUTH_URL}/token`, {
        grant_type,
        response_type,
        personal_unique_code: schacpersonaluniquecode,
        client_secret,
      })

      done(null, profile ?? undefined)
    } catch {
      return done(null)
    }
  },
)

export default signInStrategy
