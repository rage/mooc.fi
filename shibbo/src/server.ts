import express, { Request, Response } from "express"
import cors from "cors"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"
import { gql, GraphQLClient } from "graphql-request"
import { PORT, BACKEND_URL, FRONTEND_URL } from "./config"
// import axios from "axios"

const isProduction = process.env.NODE_ENV === "production"

if (isProduction && (!BACKEND_URL || !FRONTEND_URL)) {
  throw new Error("BACKEND_URL and FRONTEND_URL must be set")
}

const app = express()

const SHIBBOLETH_HEADERS = [
  "displayname",
  "schacpersonaluniquecode",
  "schachomeorganization",
  "edupersonaffiliation",
  "mail",
  "o",
  "ou",
  "SHIB_LOGOUT_URL",
] as const
type HeaderField = typeof SHIBBOLETH_HEADERS[number]

// @ts-ignore: test not using these
const defaultHeaders: Record<HeaderField, string> = {
  displayname: "kissa kissanen",
  schachomeorganization: "helsinki.fi",
  schacpersonaluniquecode:
    "urn:schac:personalUniqueCode:int:studentID:helsinki.fi:121345678",
  edupersonaffiliation: "member;student",
  mail: "mail@helsinki.fi",
  o: "University of Helsinki",
  ou: "Department of Computer Science",
  SHIB_LOGOUT_URL: "https://example.com/logout",
}

const requiredFields: HeaderField[] = [
  "schacpersonaluniquecode",
  "schachomeorganization",
  "mail",
]

app.set("port", PORT)
app.use(cors())
app.use(express.json())
app.use(shibbolethCharsetMiddleware(SHIBBOLETH_HEADERS as any))
app.use((req, res, next) => {
  const {
    headers: { cookie },
  } = req
  res.locals.cookie =
    cookie?.split(";").reduce((res, item) => {
      const data = item.trim().split("=")
      return { ...res, [data[0]]: data[1] }
    }, {}) ?? {}
  next()
})

const VERIFIED_USER_MUTATION = gql`
  mutation addVerifiedUser(
    $display_name: String
    $personal_unique_code: String!
    $home_organization: String!
    $person_affiliation: String!
    $mail: String!
    $organizational_unit: String!
  ) {
    addVerifiedUser(
      verified_user: {
        display_name: $display_name
        personal_unique_code: $personal_unique_code
        home_organization: $home_organization
        person_affiliation: $person_affiliation
        mail: $mail
        organizational_unit: $organizational_unit
      }
    ) {
      id
      personal_unique_code
    }
  }
`

// const shibCookies = ["_shibstate", "_opensaml", "_shibsession"]

const handler = async (req: Request, res: Response) => {
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

    /*Object.keys(res.locals.cookie).forEach((key) => {
      shibCookies.forEach((prefix) => {
        if (key.startsWith(prefix)) {
          res.clearCookie(key)
        }
      })
    })*/

    /*axios
      .get(`${FRONTEND_URL}/Shibboleth.sso/Logout`)
      .then((res) => console.log("logged out with", res))
      .catch((error) => console.log("error with logout", error)) // we don't care
    */
    res.redirect(
      `${FRONTEND_URL}/Shibboleth.sso/Logout?return=${FRONTEND_URL}/${language}/profile/connect/success`, // ?id=${result.addVerifiedUser.id}
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

app.get("/connect/hy", handler)

app.get("/connect/haka", handler)

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
})

export default app
