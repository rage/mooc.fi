import { Request, Response } from "express"
import { FRONTEND_URL, AUTH_URL, LOGOUT_URL, DOMAIN } from "../config"
import axios from "axios"

const grant_type = "client_authorize"
const response_type = "token"
const client_secret = "native"

export const signInHandler = async (req: Request, res: Response) => {
  const headers = req.headers

  const { schacpersonaluniquecode } = headers

  const language = req.query.language ?? "en"

  try {
    if (!schacpersonaluniquecode) {
      throw new Error("Authorization failed")
    }
    if (res.locals.access_token) {
      throw new Error("Already signed in")
    }

    const { data } = await axios.post(`${AUTH_URL}/token`, {
      grant_type,
      response_type,
      personal_unique_code: schacpersonaluniquecode,
      client_secret,
    })

    if (!data?.success) {
      throw Error(data?.message)
    }

    res
      .cookie("access_token", data.access_token, { domain: DOMAIN, path: "/" })
      .cookie("mooc_token", data.access_token, { domain: DOMAIN, path: "/" })
      .cookie("admin", data.admin, { domain: DOMAIN, path: "/" })
      .redirect(
        `${LOGOUT_URL}${FRONTEND_URL}/${
          language !== "en" ? `${language}/` : ""
        }`,
      )
  } catch (error) {
    console.log("error", error)
    res.redirect(
      `${FRONTEND_URL}/${language !== "en" ? `${language}/` : ""}sign-in/`,
    )
  }
}
