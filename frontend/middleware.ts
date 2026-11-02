// import styles, { ForegroundColor } from "ansi-styles"
import { NextRequest, NextResponse } from "next/server"

import { redirects_list } from "./Redirects"

/*const responseStatus = [
  "success",
  "info",
  "warn",
  "redirect",
  "clientError",
  "serverError",
] as const

const statusToResponseStatus = (
  status: number,
): (typeof responseStatus)[number] => {
  if (status >= 100 && status < 200) return "info"
  if (status >= 200 && status < 300) return "success"
  if (status >= 300 && status < 400) return "redirect"
  if (status >= 400 && status < 500) return "clientError"
  if (status >= 500 && status < 600) return "serverError"

  return "warn"
}

const colors: Record<(typeof responseStatus)[number], keyof ForegroundColor> = {
  success: "white",
  info: "white",
  warn: "yellow",
  redirect: "blue",
  clientError: "red",
  serverError: "red",
}

const responseStatusToColor = (status: number): keyof ForegroundColor => {
  return colors[statusToResponseStatus(status)]
}*/

const ipHeaderCandidates = [
  "x-client-ip",
  "x-forwarded-for",
  "cf-connecting-ip",
  "fastly-client-ip",
  "true-client-ip",
  "x-real-ip",
  "x-cluster-client-ip",
  "x-forwarded-for",
  "forwarded-for",
  "forwarded",
  "x-appengine-user-ip",
]

const getIp = (req: NextRequest) => {
  for (const header of ipHeaderCandidates) {
    const ip = req.headers.get(header)

    if (ip) return ip
  }
  return null
}

const loggerMiddleware = async (req: NextRequest, res: NextResponse) => {
  const remoteAddress = getIp(req) ?? req.ip ?? "-"
  const remoteUser = "user"
  const date = new Date().toISOString()
  const method = req.method
  const url = req.url
  const referrer = req.headers.get("referer") ?? "-"
  const userAgent = req.headers.get("user-agent") ?? "-"

  const status = res.status
  const httpVersion = "HTTP/1.1"
  const resContentLength = res.headers.get("content-length") ?? 1

  const message = `${remoteAddress} - ${remoteUser} [${date}] "${method} ${url} ${httpVersion}" ${status} ${resContentLength} "${referrer}" "${userAgent}"`
  const logFunction = status >= 400 ? console.error : console.log
  logFunction(message)

  return res
}

const redirectMiddleware = (req: NextRequest, res: NextResponse) => {
  const { pathname, protocol, host } = req.nextUrl.clone()
  const redirect = redirects_list.find((redirect) =>
    decodeURI(pathname).startsWith(redirect.from),
  )

  if (redirect) {
    const redirectUrl = redirect.to.startsWith("http")
      ? redirect.to
      : `${protocol}//${host}${redirect.to}`
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

const HANDOFF_LANDING_PATH = /^(\/(en|fi))?\/credit-registration-handoff\/?$/
/**
 * Must match the cookie the backend's courses-handoff redeem reads and spends. __Host- keeps other
 * mooc.fi subdomains from setting it.
 */
const SAME_SITE_ARRIVAL_COOKIE = "__Host-courses_handoff_same_site_arrival"
const COURSES_ORIGIN = new URL(
  process.env.NEXT_PUBLIC_COURSES_BASE_URL ?? "https://courses.mooc.fi",
).origin

const isFromCourses = (referer: string | null) => {
  try {
    return referer !== null && new URL(referer).origin === COURSES_ORIGIN
  } catch {
    return false
  }
}

/**
 * Tells the backend whether the student reached the handoff landing page from courses.mooc.fi.
 *
 * The landing redeems its token with a same-origin fetch, so only this navigation's own
 * Sec-Fetch-Site, which pages cannot set, shows where the student came from. Same-site covers every
 * mooc.fi subdomain, so the Referer must also name courses.mooc.fi. Anything else, missing headers
 * included, clears an earlier mark.
 */
const handoffArrivalMiddleware = (req: NextRequest, res: NextResponse) => {
  if (!HANDOFF_LANDING_PATH.test(req.nextUrl.pathname)) {
    return res
  }

  // Not Sec-Fetch-Mode: next start's proxy to the middleware rewrites it to "cors".
  const isArrivalFromCourses =
    req.headers.get("sec-fetch-site") === "same-site" &&
    req.headers.get("sec-fetch-dest") === "document" &&
    isFromCourses(req.headers.get("referer"))

  res.cookies.set(SAME_SITE_ARRIVAL_COOKIE, isArrivalFromCourses ? "1" : "", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    // Long enough for the page to load and redeem; the backend spends it on first use.
    maxAge: isArrivalFromCourses ? 60 : 0,
  })
  // A page served from cache would skip this middleware and leave the mark of an earlier visit.
  res.headers.set("Cache-Control", "no-store")
  return res
}

const middlewares = [
  redirectMiddleware,
  handoffArrivalMiddleware,
  loggerMiddleware,
]

export async function middleware(req: NextRequest) {
  let response = NextResponse.next()

  for (const mw of middlewares) {
    response = await mw(req, response)
  }
  return response
}

export const config = {
  // TODO: make this per middleware
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", { source: "/" }],
}
