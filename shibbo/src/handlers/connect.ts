import { Request, Response } from "express"
import {
  BACKEND_URL,
  FRONTEND_URL,
  LOGOUT_URL,
  requiredFields,
  defaultHeaders,
  isProduction,
} from "../config"
import { VERIFIED_USER_MUTATION } from "../graphql/verifiedUser"
import { GraphQLClient } from "graphql-request"

// const shibCookies = ["_shibstate", "_opensaml", "_shibsession"]

export const connectHandler = async (req: Request, res: Response) => {
  const headers = req.headers

  const {
    schacpersonaluniquecode,
    displayname,
    edupersonaffiliation = "",
    schachomeorganization,
    mail,
    ou,
  } = headers

  /*const shibHeaders = Object.keys(headers)
    .filter((key) => key.startsWith("shib-"))
    .reduce((obj, key) => ({ ...obj, [key]: headers[key] }), {})*/

  const { access_token: accessToken } = res.locals.cookie
  const language = req.query.language ?? "en"

  console.log(accessToken)
  console.log(JSON.stringify(req.headers, null, 2))

  try {
    if (!accessToken) {
      throw new Error("You're not authorized to do this")
    }

    if (!requiredFields.every((field) => Boolean(headers[field]))) {
      throw new Error("Required attributes missing")
    }

    const client = new GraphQLClient(BACKEND_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const result = await client.request(VERIFIED_USER_MUTATION, {
      display_name: displayname,
      personal_unique_code: schacpersonaluniquecode,
      home_organization: schachomeorganization,
      person_affiliation: edupersonaffiliation,
      mail,
      organizational_unit: ou,
    })
    console.log(result)

    /*axios
      .get(`${FRONTEND_URL}/Shibboleth.sso/Logout`, {
        headers: {
          cookie: req.headers.cookie,
          ...shibHeaders,
        },
      })
      .then((res) => console.log("logged out with", res))
      .catch((error) => console.log("error with logout", error)) // we don't care

    Object.keys(res.locals.cookie).forEach((key) => {
      shibCookies.forEach((prefix) => {
        if (key.startsWith(prefix)) {
          res.clearCookie(key)
        }
      })
    })*/

    res.redirect(
      `${LOGOUT_URL}${FRONTEND_URL}/${language}/profile/connect/success`, // ?id=${result.addVerifiedUser.id}
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : error
    const encodedError = Buffer.from(
      JSON.stringify({ error: errorMessage }),
    ).toString("base64")

    res.redirect(
      `${FRONTEND_URL}/${language}/profile/connect/failure?error=${encodedError}`,
    )
  }
}
