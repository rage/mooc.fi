import { Request, Response } from "express"
import { FRONTEND_URL, DOMAIN, isProduction } from "../config"
import axios from "axios"

const client_id = "client"
const grant_type = "password"
const response_type = "token"
const domain = isProduction ? DOMAIN : "localhost"

export const signInHandler = async (req: Request, res: Response) => {
  const headers = req.headers
  /*?? !isProduction
      ? defaultHeaders
      : ({} as Record<string, string>)*/

  const {
    schacpersonaluniquecode,
    displayname,
    edupersonaffiliation = "",
    schachomeorganization,
    mail,
    ou,
  } = headers

  const language = req.query.language ?? "en"

  try {
    if (!schacpersonaluniquecode) {
      throw new Error("Authorization failed")
    }

    const token = await axios.post(`${FRONTEND_URL}/auth/token`, {
      client_id,
      grant_type,
      response_type,
      domain,
    })
  } catch (error) {}

  res.redirect(`${FRONTEND_URL}/${language !== "en" ? `${language}/` : ""}`)
}
