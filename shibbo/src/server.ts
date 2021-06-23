import express, { Request } from "express"
import cors from "cors"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"
import { gql, GraphQLClient } from "graphql-request"
import { HY_ORGANIZATION_SECRET, HY_ORGANIZATION_ID, PORT } from "./config"
const isProduction = process.env.NODE_ENV === "production"

const API_URL = isProduction
  ? "https://www.mooc.fi/api"
  : "http://localhost:4000"
const BACKEND_URL = isProduction
  ? "https://www.mooc.fi"
  : "http://localhost:4000"

const app = express()

const SHIBBOLETH_HEADERS = ["displayname", "schachpersonaluniquecode"]

app.set("port", PORT)
app.use(cors())
app.use(express.json())
app.use(shibbolethCharsetMiddleware(SHIBBOLETH_HEADERS))

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

app.get("/hy-post-login", async (req: Request, res) => {
  const { schacpersonaluniquecode, displayname } = req.headers
  const { access_token: accessToken } = res.locals.cookie
  const language = req.query.language ?? "en"

  console.log(accessToken)
  console.log(JSON.stringify(req.headers, null, 2))

  if (!accessToken) {
    res.json({ error: "You're not authorized to do this" })
    res.status(401)
    res.end()

    return
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
    res.redirect(
      `${BACKEND_URL}/${language}/connection/test?success=${result.id}`,
    )
  } catch (error) {
    const encodedError = Buffer.from(error).toString("base64")
    res.redirect(
      `${BACKEND_URL}/${language}/connection/test?error=${encodedError}`,
    )
  }
})

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
})

export default app
