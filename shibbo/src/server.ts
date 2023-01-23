import cors from "cors"
import express, { Request, Response } from "express"
import { gql, GraphQLClient } from "graphql-request"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"

import { HY_ORGANIZATION_ID, HY_ORGANIZATION_SECRET, PORT } from "./config"

const isProduction = process.env.NODE_ENV === "production"

const API_URL = isProduction
  ? "https://www.mooc.fi/api"
  : "http://localhost:4000"
const FRONTEND_URL = isProduction
  ? "https://www.mooc.fi"
  : "http://localhost:3000"

const app = express()

const SHIBBOLETH_HEADERS = [
  "displayname",
  "schacpersonaluniquecode",
  "schachomeorganization",
] as const

const defaultHeaders: Record<(typeof SHIBBOLETH_HEADERS)[number], string> = {
  displayname: "kissa kissanen",
  schachomeorganization: "yliopisto.fi",
  schacpersonaluniquecode:
    "urn:schac:personalUniqueCode:fi:yliopisto.fi:121345678",
}

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
    $organization_id: ID!
    $organization_secret: String!
  ) {
    addVerifiedUser(
      verified_user: {
        display_name: $display_name
        personal_unique_code: $personal_unique_code
        organization_id: $organization_id
        organization_secret: $organization_secret
      }
    ) {
      id
      personal_unique_code
    }
  }
`

const handler = async (req: Request, res: Response) => {
  const headers =
    req.headers ?? !isProduction
      ? defaultHeaders
      : ({} as Record<string, string>)

  const { schacpersonaluniquecode, displayname } = headers

  const { access_token: accessToken } = res.locals.cookie
  const language = req.query.language ?? "en"

  console.log(accessToken)
  console.log(JSON.stringify(req.headers, null, 2))

  try {
    if (!accessToken) {
      throw new Error("You're not authorized to do this")
    }

    if (!schacpersonaluniquecode || !displayname) {
      throw new Error("Required attributes missing")
    }

    const client = new GraphQLClient(API_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const result = await client.request(VERIFIED_USER_MUTATION, {
      display_name: displayname,
      personal_unique_code: schacpersonaluniquecode,
      organization_id: HY_ORGANIZATION_ID,
      organization_secret: HY_ORGANIZATION_SECRET,
    })
    console.log(result)
    res.redirect(
      `${FRONTEND_URL}/${language}/connection/test?success=${result.addVerifiedUser.id}`,
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : error
    const encodedError = Buffer.from(
      JSON.stringify({ error: errorMessage }),
    ).toString("base64")
    res.redirect(
      `${FRONTEND_URL}/${language}/connection/test?error=${encodedError}`,
    )
  }
}

app.get("/hy", (req: Request, res) => {
  console.log("In HY handler")

  return handler(req, res)
  /*
  if (!accessToken) {
    res.json({ error: "You're not authorized to do this" })
    res.status(401)
    res.end()

    return
  }

  if (!schacpersonaluniquecode || !displayname) {
    res.json({ error: "some fields are missing "})
  }
  const client = new GraphQLClient(API_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  try {
    const result = await client.request(VERIFIED_USER_MUTATION, {
      display_name: displayname,
      personal_unique_code: schacpersonaluniquecode,
      organization_id: HY_ORGANIZATION_ID,
      organization_secret: HY_ORGANIZATION_SECRET,
    })
    console.log(result)
    res.redirect(
      `${FRONTEND_URL}/${language}/connection/test?success=${result.addVerifiedUser.id}`,
    )
  } catch (error) {
    const encodedError = Buffer.from(JSON.stringify(error)).toString("base64")
    res.redirect(
      `${FRONTEND_URL}/${language}/connection/test?error=${encodedError}`,
    )
  }
  */
})

app.get("/haka", (req, res) => {
  console.log("In Haka handler")

  return handler(req, res)
})

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
})

export default app
