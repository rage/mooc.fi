import axios from "axios"
import { NextFunction, Request, Response } from "express"

import { API_URL, AUTH_URL, FRONTEND_URL } from "../config"
import { AuthenticationHandlerCallback } from "./callback"

const grant_type = "client_authorize"
const response_type = "token"
const client_secret = "native"

interface StatusType {
  error: boolean
  type: string
  query: string[]
}

const errorHandler =
  (language: string, errorType: string, query: string[], error?: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.logout()
    let redirectUrl = ""

    // TODO: show these on the actual sign-up page
    query.push(`error=${errorType ?? "unknown"}`)
    if (error) {
      query.push(`message=${decodeURIComponent(error)}`)
    }
    redirectUrl = `${FRONTEND_URL}/${language}/sign-up?${query.join("&")}`

    if (!res.headersSent) {
      return res.redirect(redirectUrl)
    } else {
      return next()
    }
  }

export const signUpHandler: AuthenticationHandlerCallback =
  (req, res, next) => async (err, user) => {
    const {
      schac_personal_unique_code,
      display_name,
      given_name,
      sn,
      edu_person_affiliation = "",
      schac_home_organization,
      mail,
      organizational_unit,
      o,
      edu_person_principal_name,
    } = user ?? {}

    const language = ((Array.isArray(req.query.language)
      ? req.query.language[0]
      : req.query.language) ?? "en") as string

    const query = [] as string[]
    let errorType = ""

    // confidently default to an error

    if (err || !user || !edu_person_principal_name) {
      return errorHandler(language, "unknown", query, err)(req, res, next)
    }

    // ;(async () => {
    try {
      const { data } = await axios.post(`${API_URL}/user/register`, {
        eduPersonPrincipalName: edu_person_principal_name,
        personalUniqueCode: schac_personal_unique_code,
        firstName: given_name,
        lastName: sn,
        personAffiliation: edu_person_affiliation,
        mail,
        organization: o,
        organizationalUnit: organizational_unit,
        displayName: display_name,
        homeOrganization: schac_home_organization,
      })
    } catch (error: any) {
      errorType = "sign-up-error"
      const { data } = error?.response
      console.log("sign-up-error", data)
      if (data.user?.id) {
        // user already exists

        if (!data.verified_user?.id) {
          if (data.access_token) {
            errorType = "verify-user"
            // is logged in but not verified
            res.setMOOCCookies({
              access_token: data.access_token ?? "",
              mooc_token: data.access_token ?? "",
              admin: data.user.administrator ?? "",
            })
          } else {
            // not verified, not logged in
            // errorType?
            query.push(`email=${encodeURIComponent(data.user.email)}`)
            // TODO: prompt user to login with previous details and verify account
          }
        } else {
          query.push(`email=${encodeURIComponent(data.user.email)}`)
          errorType = "already-registered"
          // TODO: show some info to user about this, redirect to details?
        }
      }
      return errorHandler(
        language,
        errorType,
        query,
        error?.response,
      )(req, res, next)
    }

    try {
      const { data: tokenData } = await axios.post<any>(`${AUTH_URL}/token`, {
        grant_type,
        response_type,
        edu_person_principal_name,
        client_secret,
      })

      res.setMOOCCookies({
        access_token: tokenData.access_token ?? "",
        mooc_token: tokenData.access_token ?? "",
        admin: tokenData.admin ?? "",
      })

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
    } catch (error) {
      errorType = "token-issue"
      // couldn't issue a token
      req.logout()
      return errorHandler(language, errorType, query, error)(req, res, next)
    }
    //})().catch((error) => {
    //  req.logout()
    //  return errorHandler(language, errorType, query, error)(req, res, next)
    //})

    // TODO: find something else than this
    let redirectUrl = `${FRONTEND_URL}/${language}/sign-up/edit-details`

    if (query) {
      redirectUrl += `?${query.join("&")}`
    }

    return res.redirect(redirectUrl)
  }
