import { Request, Response } from "express"
import { FRONTEND_URL } from "../config"

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

  res.redirect(`${FRONTEND_URL}/${language !== "en" ? `${language}/` : ""}`)
}
