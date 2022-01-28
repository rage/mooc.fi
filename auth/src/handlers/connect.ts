import { NextFunction, Request, Response } from "express"
import { GraphQLClient } from "graphql-request"

import { BACKEND_URL, FRONTEND_URL } from "../config"
import { VERIFIED_USER_MUTATION } from "../graphql/verifiedUser"
import { decodeRelayState, getErrorMessage, getQueryString } from "../util"
import { AuthenticationHandlerCallback } from "./"

const getRedirectURL = (
  language: string,
  origin: string = "profile",
  success: boolean,
  query: Record<string, any> = {},
) => {
  const queryString = Object.keys(query)
    .sort()
    .map((key) => (Boolean(query[key]) ? `${key}=${query[key]}` : undefined))
    .filter((key) => Boolean(key))
    .join("&")

  switch (origin) {
    case "connect":
      return `${FRONTEND_URL}/${language}/profile/connect/${
        success ? "success" : "failure"
      }${queryString ? `?${queryString}` : ""}`
    case "profile":
    default:
      return `${FRONTEND_URL}/${language}/profile/?tab=connections&success=${success}${
        queryString ? `&${queryString}` : ""
      }`
  }
}

const errorHandler =
  (language: string, errorType: string, error: any, origin?: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.logout()
    const errorMessage = error instanceof Error ? error.message : error
    const encodedError = errorMessage
      ? encodeURIComponent(errorMessage)
      : undefined

    // TODO: add message?
    if (!res.headersSent) {
      res.redirect(
        getRedirectURL(language, origin, false, {
          error: errorType,
          message: encodedError,
        }),
      )
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
      return errorHandler(language, "auth-fail", err, origin)(req, res, next)
    }
    if (!user || !edu_person_principal_name) {
      return errorHandler(
        language,
        "no-user",
        undefined,
        origin,
      )(req, res, next)
    }
    if (!accessToken) {
      return errorHandler(
        language,
        "not-logged-in",
        undefined,
        origin,
      )(req, res, next)
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
      res.redirect(
        getRedirectURL(language, origin, true),
        // `${FRONTEND_URL}/${language}/profile/connect/success`, // ?id=${result.addVerifiedUser.id}
      )
      //})().catch((error) => {
    } catch (error) {
      return errorHandler(language, "auth-fail", error, origin)(req, res, next)
    }
  }
