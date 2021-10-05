import { RequestHandler } from "express"
import { GraphQLClient } from "graphql-request"
import passport, { AuthenticateOptions } from "passport"

import {
  BACKEND_URL,
  FRONTEND_URL,
  LOGOUT_URL,
  requiredFields,
} from "../config"
import { VERIFIED_USER_MUTATION } from "../graphql/verifiedUser"
import { encodeRelayState } from "../util/relayState"

export const connectHandler: RequestHandler = (req, res, next) => {
    const relayState = encodeRelayState(req)

    passport.authenticate(
      "multi",
      {
        additionalParams: {
          RelayState: relayState
        },
      } as AuthenticateOptions,
      async (err, user) => {
        console.log("connect with user", user)
        const {
          schacpersonaluniquecode,
          displayname,
          edupersonaffiliation = "",
          schachomeorganization,
          mail = user.edupersonprincipalname,
          ou,
        } = user
      
        /*const shibHeaders = Object.keys(headers)
          .filter((key) => key.startsWith("shib-"))
          .reduce((obj, key) => ({ ...obj, [key]: headers[key] }), {})*/
      
        const { access_token: accessToken } = res.locals.cookie
        const language = req.query.language || req.params.language || "en"
      
        console.log(accessToken)
        console.log(JSON.stringify(req.headers, null, 2))
      
        try {
          if (!accessToken) {
            throw new Error("You're not authorized to do this")
          }
      
          console.log("requiredFields", requiredFields)
          console.log("user", user)
          if (!requiredFields.every((field) => Boolean(user[field]))) {
            throw new Error("Required attributes missing")
          }
      
          const client = new GraphQLClient(BACKEND_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          const result = await client.request(VERIFIED_USER_MUTATION, {
            display_name: displayname,
            personal_unique_code: schacpersonaluniquecode,
            home_organization: schachomeorganization,
            person_affiliation: edupersonaffiliation,
            mail,
            organizational_unit: ou,
          })
          console.log(result)
      
          /*axios
            .get(`${FRONTEND_URL}/Shibboleth.sso/Logout`, {
              headers: {
                cookie: req.headers.cookie,
                ...shibHeaders,
              },
            })
            .then((res) => console.log("logged out with", res))
            .catch((error) => console.log("error with logout", error)) // we don't care
      
          Object.keys(res.locals.cookie).forEach((key) => {
            shibCookies.forEach((prefix) => {
              if (key.startsWith(prefix)) {
                res.clearCookie(key)
              }
            })
          })*/
      
          res.redirect(
            `${LOGOUT_URL}${FRONTEND_URL}/${language}/profile/connect/success`, // ?id=${result.addVerifiedUser.id}
          )
        } catch (error) {
          console.log("I've errored with", error)
          const errorMessage = error instanceof Error ? error.message : error
          const encodedError = Buffer.from(
            JSON.stringify({ error: errorMessage }),
          ).toString("base64")
      
          res.redirect(
            `${FRONTEND_URL}/${language}/profile/connect/failure?error=${encodedError}`,
          )
        }
      }
    )(req, res, next)
}