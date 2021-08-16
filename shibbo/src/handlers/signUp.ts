import axios from "axios"
import { Request, Response } from "express"
import { AUTH_URL, API_URL, FRONTEND_URL, LOGOUT_URL } from "../config"

const grant_type = "client_authorize"
const response_type = "token"
const client_secret = "native"

export const signUpHandler = async (req: Request, res: Response) => {
  const headers = req.headers

  const {
    schacpersonaluniquecode,
    displayname,
    givenName,
    sn,
    edupersonaffiliation = "",
    schachomeorganization,
    mail,
    ou,
  } = headers

  const language = req.query.language ?? "en"
  const languagePath = language !== "en" ? `${language}/` : ""

  try {
    const { data } = await axios.post(`${API_URL}/user/register`, {
      personalUniqueCode: schacpersonaluniquecode,
      firstName: givenName,
      lastName: sn,
      personAffiliation: edupersonaffiliation,
      mail,
      organizationalUnit: ou,
      displayName: displayname,
      homeOrganization: schachomeorganization,
    })
    console.log("got register data", data)

    try {
      const { data: tokenData } = await axios.post(`${AUTH_URL}/token`, {
        grant_type,
        response_type,
        personal_unique_code: schacpersonaluniquecode,
        client_secret,
      })

      return res
        .cookie("access_token", tokenData.access_token)
        .cookie("mooc_token", tokenData.access_token)
        .cookie("admin", tokenData.admin)
        .redirect(
          `${LOGOUT_URL}${FRONTEND_URL}/${languagePath}sign-up/edit-details`,
        )
    } catch (error) {
      console.log("sign-up error with token issuing", error)
      // couldn't issue a token
      return res.redirect(
        `${FRONTEND_URL}/${languagePath}sign-up/error/token-issue`,
      )
    }
  } catch (error) {
    console.log("sign-up error", error.response)
    const { data } = error.response

    if (data.user?.id) {
      // user already exists

      // set cookies in case we have them
      res
        .cookie("access_token", data.access_token ?? "")
        .cookie("mooc_token", data.access_token ?? "")
        .cookie("admin", data.user.administrator || "")

      if (!data.verified_user?.id) {
        return res.redirect(
          `${LOGOUT_URL}${FRONTEND_URL}/${languagePath}sign-up/error/verify-user`,
        )
        // TODO: prompt user to login with previous details and verify account
      } else {
        // TODO: show some info to user about this, redirect to details?
        return res.redirect(
          `${LOGOUT_URL}${FRONTEND_URL}/${languagePath}sign-up/error/already-registered`,
        )
      }
    }

    return res.redirect(
      `${LOGOUT_URL}${FRONTEND_URL}/${languagePath}sign-up/error`,
    )
  }
}
