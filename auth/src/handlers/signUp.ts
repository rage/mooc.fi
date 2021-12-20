import axios from "axios"

import { API_URL, AUTH_URL, FRONTEND_URL } from "../config"
import { AuthenticationHandlerCallback } from "./callback"

const grant_type = "client_authorize"
const response_type = "token"
const client_secret = "native"

export const signUpHandler: AuthenticationHandlerCallback =
  (req, res, _next) => async (_err, user) => {
    const {
      schacpersonaluniquecode,
      displayname,
      givenName,
      sn,
      edupersonaffiliation = "",
      schachomeorganization,
      mail,
      ou,
      o,
      edupersonprincipalname,
    } = user

    const language = req.query.language ?? "en"

    // confidently default to an error
    let status = {
      error: true,
      type: "",
      query: [] as string[],
    }

    try {
      const { data } = await axios.post(`${API_URL}/user/register`, {
        eduPersonPrincipalName: edupersonprincipalname,
        personalUniqueCode: schacpersonaluniquecode,
        firstName: givenName,
        lastName: sn,
        personAffiliation: edupersonaffiliation,
        mail,
        organization: o,
        organizationalUnit: ou,
        displayName: displayname,
        homeOrganization: schachomeorganization,
      })
      console.log("got register data", data)

      try {
        const { data: tokenData } = await axios.post<any>(`${AUTH_URL}/token`, {
          grant_type,
          response_type,
          edu_person_principal_name: edupersonprincipalname,
          client_secret,
        })

        res.setMOOCCookies({
          access_token: tokenData.access_token ?? "",
          mooc_token: tokenData.access_token ?? "",
          admin: tokenData.admin ?? "",
        })

        status.error = false
        /*return res
          .setMOOCCookies({
            access_token: tokenData.access_token ?? "",
            mooc_token: tokenData.access_token ?? "",
            admin: tokenData.admin ?? "",
          })
          .redirect(
            `${LOGOUT_URL}${FRONTEND_URL}/${languagePath}sign-up/edit-details`,
          )*/
      } catch (error) {
        // couldn't issue a token
        status.type = "token-issue"
      }
    } catch (error: any) {
      console.log("sign-up error", error?.response)
      const { data } = error?.response

      if (data.user?.id) {
        // user already exists

        if (!data.verified_user?.id) {
          status.type = "verify-user"

          if (data.access_token) {
            // is logged in but not verified
            res.setMOOCCookies({
              access_token: data.access_token ?? "",
              mooc_token: data.access_token ?? "",
              admin: data.user.administrator ?? "",
            })
          } else {
            // not verified, not logged in
            status.query.push(`email=${encodeURIComponent(data.user.email)}`)
            // TODO: prompt user to login with previous details and verify account
          }
        } else {
          status.query.push(`email=${encodeURIComponent(data.user.email)}`)
          status.type = "already-registered"
          // TODO: show some info to user about this, redirect to details?
        }
      }
    }

    let redirectUrl = ""

    // TODO: show these on the actual sign-up page
    if (status.error) {
      status.query.push(`error=${status.type}`)
      redirectUrl = `${FRONTEND_URL}/${language}/sign-up`
    } else {
      // TODO: find something else than this
      redirectUrl = `${FRONTEND_URL}/${language}/sign-up/edit-details`
    }

    if (status.query) {
      redirectUrl += `?${status.query.join("&")}`
    }

    return res.redirect(redirectUrl)
  }
