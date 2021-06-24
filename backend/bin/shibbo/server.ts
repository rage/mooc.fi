import express, { Request } from "express"
import cors from "cors"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"
import { HY_ORGANIZATION_ID, PORT } from "./config"
import prisma from "../../prisma"
import sentryLogger from "../lib/logger"
import { getUserDetailsFromToken } from "../../util/server-functions"

const isProduction = process.env.NODE_ENV === "production"

const FRONTEND_URL = isProduction
  ? "https://www.mooc.fi"
  : "http://localhost:3000"

const logger = sentryLogger({ service: "moocfi-shibbo" })

const app = express()

const SHIBBOLETH_HEADERS = [
  "displayname",
  "schacpersonaluniquecode",
  "schachomeorganization",
] as const

type HeaderField = typeof SHIBBOLETH_HEADERS[number]
type Headers = Record<HeaderField, string>

const defaultHeaders: Headers = {
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

const getUser = async (accessToken: string) => {
  const userDetails = await getUserDetailsFromToken(accessToken)

  if (userDetails.isErr()) {
    return null
  }
  const { details } = userDetails.value

  const user = await prisma.user.findUnique({
    where: {
      upstream_id: details.id,
    },
  })

  return user
}

/*const findOrganization = async (organization_id: string) => {
  const organization = await prisma.organization.findUnique({
    where: { id: organization_id }
  })
}*/

interface CreateVerifiedUserParams {
  headers: Record<string, string>
  required?: Array<HeaderField>
  organization_id: string
  user_id: string
}

const createVerifiedUser = async ({
  organization_id,
  user_id,
  headers,
  required = ["schacpersonaluniquecode", "displayname"],
}: CreateVerifiedUserParams) => {
  if (!required.every((field) => Boolean(headers[field]))) {
    throw new Error(`Required attributes missing - need ${required.join(", ")}`)
  }

  const result = await prisma.verifiedUser.create({
    data: {
      display_name: headers["displayname"],
      personal_unique_code: headers["schacpersonaluniquecode"],
      organization: { connect: { id: organization_id } },
      user: { connect: { id: user_id } },
    },
  })

  return result
}

app.get("/hy", async (req: Request, res) => {
  const headers =
    req.headers ?? !isProduction
      ? defaultHeaders
      : ({} as Record<string, string>)

  const { access_token: accessToken } = res.locals.cookie
  const language = req.query.language ?? "en"

  console.log(accessToken)
  console.log(JSON.stringify(req.headers, null, 2))

  try {
    if (!accessToken) {
      throw new Error("You're not authorized to do this")
    }

    const user = await getUser(`Bearer ${accessToken}`)

    if (!user) {
      throw new Error("User not found")
    }

    const result = await createVerifiedUser({
      organization_id: HY_ORGANIZATION_ID,
      user_id: user.id,
      headers,
    })

    console.log(result)

    if (!result) {
      throw new Error("Could not create verified user")
    }

    res.redirect(
      `${FRONTEND_URL}/${language}/connection/test?success=${result.id}`,
    )
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(error))
    const errorMessage = error instanceof Error ? error.message : error
    const encodedError = Buffer.from(
      JSON.stringify({ error: errorMessage }),
    ).toString("base64")
    res.redirect(
      `${FRONTEND_URL}/${language}/connection/test?error=${encodedError}`,
    )
  }
})

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
})

export default app
