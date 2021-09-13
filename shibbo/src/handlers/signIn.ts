import axios from "axios"
import { Request, Response } from "express"

import { API_URL, AUTH_URL, FRONTEND_URL, LOGOUT_URL } from "../config"

const grant_type = "client_authorize"
const response_type = "token"
const client_secret = "native"

export const signInHandler = async (req: Request, res: Response) => {
  const headers = req.headers

  const {
    schacpersonaluniquecode,
    edupersonaffiliation = "",
    schachomeorganization,
  } = headers

  const language = req.query.language ?? "en"

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
      const { data } = await axios.post(`${AUTH_URL}/token`, {
        grant_type,
        response_type,
        personal_unique_code: schacpersonaluniquecode,
        client_secret,
      })

      try {
        // @ts-ignore: ignore return value for now
        const { data: updateData } = await axios.post(
          `${API_URL}/user/update-person-affiliation`,
          {
            personal_unique_code: schacpersonaluniquecode,
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
    res.redirect(
      `${LOGOUT_URL}${FRONTEND_URL}/${language}/sign-in?error=${
        errorType ?? "unknown"
      }&message=${decodeURIComponent(error?.response?.data.message)}`,
    )
  }
}
