import axios from "axios"

import { API_URL, AUTH_URL, FRONTEND_URL } from "../config"
import { AuthenticationHandlerCallback } from "./callback"

const grant_type = "client_authorize"
const response_type = "token"
const client_secret = "native"

export const signInHandler: AuthenticationHandlerCallback = (
  req,
  res,
  _next,
) => async (_err, user) => {
  console.log("signInHandler: user", user)
  const {
    edupersonprincipalname,
    edupersonaffiliation,
    schachomeorganization,
  } = user ?? {}
  const language = req.query.language || req.params.language || "en"

  let errorType = undefined

  try {
    if (!edupersonprincipalname) {
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
        edu_person_principal_name: edupersonprincipalname,
        client_secret,
      })

      try {
        // @ts-ignore: ignore return value for now
        const { data: updateData } = await axios.post(
          `${API_URL}/user/update-person-affiliation`,
          {
            edu_person_principal_name: edupersonprincipalname,
            person_affiliation: edupersonaffiliation,
            home_organization: schachomeorganization,
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
      req.login(user, (err) => {
        if (err) {
          console.log("login error", err)
        }
      })

      req.logout()
      res
        .setMOOCCookies({
          access_token: data.access_token ?? "",
          mooc_token: data.access_token ?? "",
          admin: data.admin ?? "",
        })
        .redirect(`${FRONTEND_URL}/${language !== "en" ? `${language}/` : ""}`)
    } catch (error: any) {
      errorType = "no-user-found"
      throw error
    }
  } catch (error: any) {
    console.log("I have errored", error)
    req.logout()
    res.redirect(
      `${FRONTEND_URL}/${language}/sign-in?error=${
        errorType ?? "unknown"
      }&message=${decodeURIComponent(error?.response?.data.message)}`,
    )
  }
}
