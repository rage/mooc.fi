import { NextFunction, Request, Response } from "express"
import { GraphQLClient } from "graphql-request"

import { BACKEND_URL, FRONTEND_URL } from "../config"
import { VERIFIED_USER_MUTATION } from "../graphql/verifiedUser"
import {
  buildQueryString,
  decodeRelayState,
  getErrorMessage,
  getQueryString,
} from "../util"
import { AuthenticationHandlerCallback } from "./"

interface GetRedirectURLParams {
  language: string
  origin?: string
  success?: boolean
  query?: Array<string>
}

const getRedirectURL = ({
  language,
  origin = "profile",
  success = false,
  query = [],
}: GetRedirectURLParams) => {
  switch (origin) {
    case "connect":
      return `${FRONTEND_URL}/${language}/profile/connect/${
        success ? "success" : "failure"
      }${buildQueryString(query)}`
    case "profile":
    default:
      query.unshift(`success=${success}`)
      query.unshift(`tab=connections`)

      return `${FRONTEND_URL}/${language}/profile/${buildQueryString(query)}`
  }
}

interface ErrorHandlerParams {
  language: string
  errorType?: string
  error?: any
  origin?: string
}

const errorHandler =
  ({ language, errorType, error, origin }: ErrorHandlerParams) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.logout()
    const errorMessage = getErrorMessage(error) // error instanceof Error ? error.message : error

    const query = [
      `error=${errorType ?? "unknown"}`,
      `message=${encodeURIComponent(errorMessage)}`,
    ]

    // TODO: add message?
    if (!res.headersSent) {
      res.redirect(getRedirectURL({ language, origin, success: false, query }))
    } else {
      next(error)
    }
  }

export const connectHandler: AuthenticationHandlerCallback =
  (req, res, next) => async (err, user) => {
    const {
      schac_personal_unique_code,
      display_name,
      given_name,
      sn,
      edu_person_affiliation = "",
      schac_home_organization,
      mail,
      ou,
      o,
      edu_person_principal_name,
    } = user ?? {}

    const { access_token: accessToken } = res?.locals?.cookie || {}
    const relayState = decodeRelayState(req)
    const language = (getQueryString(req.query.language) ||
      relayState?.language ||
      req.params.language ||
      "en") as string
    const origin =
      getQueryString(req.query.origin) ||
      relayState?.origin ||
      req.params.origin

    if (err) {
      return errorHandler({
        language,
        errorType: "auth-fail",
        error: err,
        origin,
      })(req, res, next)
    }
    if (!user || !edu_person_principal_name) {
      return errorHandler({
        language,
        errorType: "no-user",
        origin,
      })(req, res, next)
    }
    if (!accessToken) {
      return errorHandler({
        language,
        errorType: "not-logged-in",
        origin,
      })(req, res, next)
    }

    try {
      try {
        const client = new GraphQLClient(BACKEND_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const result = await client.request(VERIFIED_USER_MUTATION, {
          display_name: display_name,
          edu_personal_principal_name: edu_person_principal_name,
          personal_unique_code: schac_personal_unique_code,
          home_organization: schac_home_organization,
          person_affiliation: edu_person_affiliation,
          mail,
          organizational_unit: ou,
          first_name: given_name,
          last_name: sn,
          organization: o,
        })
      } catch (err) {
        console.log(getErrorMessage(err))
        throw new Error("GraphQL error")
      }

      await new Promise<void>((resolve, reject) =>
        req.login(user, (err) => {
          if (err) {
            console.log("login error", err)
            reject(err)
          } else {
            resolve()
          }
        }),
      )
      req.logout()
      res.redirect(getRedirectURL({ language, origin, success: true }))
    } catch (error) {
      return errorHandler({
        language,
        errorType: "auth-fail",
        error,
        origin,
      })(req, res, next)
    }
  }
