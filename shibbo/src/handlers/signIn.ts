import axios from "axios"
import { RequestHandler } from "express"
import passport, { AuthenticateOptions } from "passport"

import {
  AUTH_URL,
  FRONTEND_URL,
  LOGOUT_URL,
} from "../config"
import { encodeRelayState } from "../util/relayState"

const grant_type = "client_authorize"
const response_type = "token"
const client_secret = "native"

export const signinHandler: RequestHandler = (req, res, next) => {  // console.log("signinHandler", req)
  const relayState = encodeRelayState(req)

  passport.authenticate(
    "multi",
    {
      additionalParams: {
        RelayState: relayState
      },
    } as AuthenticateOptions,
    async (err, user) => {
      const { schacpersonaluniquecode } = user
      const language = req.query.language || req.params.language || "en"

      let errorType = undefined

      try {
        if (!schacpersonaluniquecode) {
          errorType = "auth-fail"
          throw new Error("Authorization failed")
        }
        if (res.locals.access_token) {
          errorType = "already-signed-in"
          throw new Error("Already signed in")
        }
    
        try {
          const { data } = await axios.post<any>(`${AUTH_URL}/token`, {
            grant_type,
            response_type,
            personal_unique_code: schacpersonaluniquecode,
            client_secret,
          })
    
          req.login(user, (err) => {
            if (err) {
              console.log("login error", err)
            }
          })
          
          res
            .setMOOCCookies({
              access_token: data.access_token ?? "",
              mooc_token: data.access_token ?? "",
              admin: data.admin ?? "",
            })
            .redirect(
              `${LOGOUT_URL}${FRONTEND_URL}/${
                language !== "en" ? `${language}/` : ""
              }`,
            )
        } catch (error: any) {
          errorType = "no-user-found"
          throw error
        }
      } catch (error: any) {
        console.log("I have errored", error)
        res.redirect(
          `${LOGOUT_URL}${FRONTEND_URL}/${language}/sign-in?error=${errorType ?? "unknown"}&message=${decodeURIComponent(
            error?.response?.data.message,
          )}`,
        )
      }
    },
  )(req, res, next)
}