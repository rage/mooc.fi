import axios from "axios"
import { Request, Response } from "express"
import { AUTH_URL, BACKEND_URL, FRONTEND_URL } from "../config"

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

  console.log(language, languagePath)

  const moocfi_status_cookie: Record<string, any> = {}

  try {
    const { data } = await axios.post(`${BACKEND_URL}/api/register`, {
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

    moocfi_status_cookie.has_tmc = Boolean(data?.tmc_user?.id)

    const { data: tokenData } = await axios.post(`${AUTH_URL}/token`, {
      grant_type,
      response_type,
      personal_unique_code: schacpersonaluniquecode,
      client_secret,
    })

    res
      .cookie("access_token", tokenData.access_token)
      .cookie("mooc_token", tokenData.access_token)
      .cookie("admin", tokenData.admin)
      .cookie("__moocfi_register_status", JSON.stringify(moocfi_status_cookie))
      .redirect(
        `${FRONTEND_URL}/Shibboleth.sso/Logout?return=${FRONTEND_URL}/${languagePath}}sign-up/edit-details`,
      )
  } catch (error) {
    const { data } = error.response

    console.log("data", data)
    if (data.user) {
      // user already exists
      if (!data.verified_user) {
        // TODO: prompt user to login with previous details and verify account
      } else {
        if (data.access_token) {
          // has valid access token, just log in
          // TODO: show some info to user about this, redirect to details?
          return res
            .cookie("access_token", data.access_token)
            .cookie("mooc_token", data.access_token)
            .cookie("admin", data.user.administrator || false)
            .redirect(
              `${FRONTEND_URL}/Shibboleth.sso/Logout?return=${FRONTEND_URL}/${languagePath}`,
            )
        }
      }
    }

    return res.redirect(
      `${FRONTEND_URL}/Shibboleth.sso/Logout?return=${FRONTEND_URL}/${languagePath}}sign-up/error`,
    )
  }

  res.redirect(`${FRONTEND_URL}/${languagePath}`)
}
