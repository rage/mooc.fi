import axios from "axios"
import { NextFunction, Request, Response } from "express"

import { API_URL, AUTH_URL, FRONTEND_URL } from "../config"
import { buildQueryString, decodeRelayState, getQueryString } from "../util"
import { AuthenticationHandlerCallback } from "./callback"

const grant_type = "client_authorize"
const response_type = "token"
const client_secret = "native"

interface ErrorHandlerParams {
  language: string
  errorType?: string
  query?: Array<string>
  error?: any
}

const errorHandler =
  ({ language, errorType, query = [], error }: ErrorHandlerParams) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.logout()

    query.push(`error=${errorType ?? "unknown"}`)
    if (error) {
      query.push(`message=${encodeURIComponent(error)}`)
    }

    if (!res.headersSent) {
      return res.redirect(
        `${FRONTEND_URL}/${language}/sign-in${buildQueryString(query)}`,
      )
    } else {
      return next(error)
    }
  }

export const signInHandler: AuthenticationHandlerCallback =
  (req, res, next) => async (err, user) => {
    console.log("signInHandler: user", user)

    const {
      edu_person_principal_name,
      edu_person_affiliation,
      schac_home_organization,
    } = user ?? {}

    const relayState = decodeRelayState(req)
    const language = (getQueryString(req.query.language) ||
      req.params.language ||
      relayState?.language ||
      "en") as string

    let errorType: string

    if (err || !user || !edu_person_principal_name) {
      return errorHandler({
        language,
        errorType: "auth-fail",
        error: err,
      })(req, res, next)
    }

    if (res.locals.access_token) {
      return errorHandler({
        language,
        errorType: "already-signed-in",
        error: err,
      })(req, res, next)
    }

    try {
      const { data } = await axios.post<any>(`${AUTH_URL}/token`, {
        grant_type,
        response_type,
        edu_person_principal_name,
        client_secret,
      })
      try {
        // @ts-ignore: ignore return value for now
        const { data: updateData } = await axios.post(
          `${API_URL}/user/update-person-affiliation`,
          {
            edu_person_principal_name,
            person_affiliation: edu_person_affiliation,
            home_organization: schac_home_organization,
          },
          {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          },
        )
      } catch {
        // we'll just ignore the affiliation update error
      }

      await new Promise<void>((resolve, reject) =>
        req.login(user, (err) => {
          if (err) {
            // TODO: what to actually do here?
            // Do we even need the login/logout if there is no session?
            // Now this will just unceremoniously bail out -- need try/catch?
            debug.log("login error", err)
            reject(err)
          } else {
            resolve()
          }
        }),
      )

      req.logout()
      return res
        .setMOOCCookies({
          access_token: data.access_token ?? "",
          mooc_token: data.access_token ?? "",
          admin: data.admin ?? "",
        })
        .redirect(`${FRONTEND_URL}/${language !== "en" ? `${language}/` : ""}`)
    } catch (error: any) {
      errorType = "no-user-found"
      return errorHandler({
        language,
        errorType,
        error: error?.response?.data.message,
      })(req, res, next)
    }
  }
