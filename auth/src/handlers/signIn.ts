import axios from "axios"

import { API_URL, AUTH_URL, FRONTEND_URL } from "../config"
import { decodeRelayState } from "../util"
import { AuthenticationHandlerCallback } from "./callback"

const grant_type = "client_authorize"
const response_type = "token"
const client_secret = "native"

export const signInHandler: AuthenticationHandlerCallback = (
  req,
  res,
  next,
) => (err, user) => {
  console.log("signInHandler: user", user)

  const {
    edu_person_principal_name,
    edu_person_affiliation,
    schac_home_organization,
  } = user ?? {}

  const relayState = decodeRelayState(req)
  const language =
    req.query.language || req.params.language || relayState?.language || "en"

  let errorType: any = undefined

  try {
    if (err) {
      errorType = "auth-fail"
      console.log("failed with handler error", err)
      throw new Error(err)
    }

    if (!edu_person_principal_name) {
      errorType = "auth-fail"
      throw new Error("Authorization failed")
    }
    if (res.locals.access_token) {
      errorType = "already-signed-in"
      throw new Error("Already signed in")
    }

    ;(async () => {
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
              console.log("login error", err)
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
          .redirect(
            `${FRONTEND_URL}/${language !== "en" ? `${language}/` : ""}`,
          )
      } catch (error: any) {
        errorType = "no-user-found"
        throw error
      }
    })().catch((error) => {
      req.logout()
      if (!res.headersSent) {
        res.redirect(
          `${FRONTEND_URL}/${language}/sign-in?error=${
            errorType ?? "unknown"
          }&message=${decodeURIComponent(error?.response?.data.message)}`,
        )
      } else {
        next(error)
      }
    })
  } catch (error: any) {
    console.log("I have errored", error)
    req.logout()
    return res.redirect(
      `${FRONTEND_URL}/${language}/sign-in?error=${
        errorType ?? "unknown"
      }&message=${decodeURIComponent(error?.response?.data.message)}`,
    )
  }
}
