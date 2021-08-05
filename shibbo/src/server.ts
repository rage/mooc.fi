import express, { Request, Response } from "express"
import cors from "cors"
import shibbolethCharsetMiddleware from "unfuck-utf8-headers-middleware"
import { PORT, BACKEND_URL, FRONTEND_URL, SHIBBOLETH_HEADERS } from "./config"
import { connectHandler, signInHandler } from "./handlers"

const isProduction = process.env.NODE_ENV === "production"

if (isProduction && (!BACKEND_URL || !FRONTEND_URL)) {
  throw new Error("BACKEND_URL and FRONTEND_URL must be set")
}

const app = express()

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

app.get("/connect/hy", connectHandler)
app.get("/connect/haka", connectHandler)

app.get("/sign-in/hy", signInHandler)
app.get("/sign-in/haka", signInHandler)
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
})

export default app
