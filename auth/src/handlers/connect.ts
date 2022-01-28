import { NextFunction, Request, Response } from "express"
import { GraphQLClient } from "graphql-request"

import { BACKEND_URL, FRONTEND_URL } from "../config"
import { VERIFIED_USER_MUTATION } from "../graphql/verifiedUser"
import { decodeRelayState } from "../util"
import { AuthenticationHandlerCallback } from "./"

const errorHandler =
  (language: string, errorType: string, error: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.logout()
    const errorMessage = error instanceof Error ? error.message : error
    const encodedError = encodeURIComponent(errorMessage)

    // TODO: add message?
    if (!res.headersSent) {
      res.redirect(
        `${FRONTEND_URL}/${language}/profile/connect/failure?error=${errorType}`,
      )
    } else {
      next(error)
    }
  }

export const connectHandler: AuthenticationHandlerCallback =
  (req, res, next) => async (err, user) => {
    console.log("connect with user", user)

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

    const { access_token: accessToken } = res.locals.cookie
    console.log("accessToken", accessToken)
    const relayState = decodeRelayState(req)
    const language = ((Array.isArray(req.query.language)
      ? req.query.language[0]
      : req.query.language) ||
      relayState?.language ||
      req.params.language ||
      "en") as string

    if (err || !user || !edu_person_principal_name) {
      return errorHandler(language, "auth-fail", err)(req, res, next)
    }
    if (!accessToken) {
      return errorHandler(language, "auth-fail", err)(req, res, next)
    }

    console.log("user", user)
    /*if (!requiredFields.every((field) => Boolean(user[field]))) {
      debug.log(
        "missing required fields - needed: ",
        requiredFields,
        "got: ",
        Object.keys(user),
      )
      return errorHandler(language, "auth-fail", err)(req, res, next)
    }*/

    console.log(accessToken)
    console.log(JSON.stringify(req.headers, null, 2))
    //;(async () => {
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
      console.log(result)

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
        `${FRONTEND_URL}/${language}/profile/connect/success`, // ?id=${result.addVerifiedUser.id}
      )
      //})().catch((error) => {
    } catch (error) {
      return errorHandler(language, "auth-fail", error)(req, res, next)
    }
    //})
  }
