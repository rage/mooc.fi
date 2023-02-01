import styles, { ForegroundColor } from "ansi-styles"
import { NextRequest, NextResponse } from "next/server"

import { redirects_list } from "./Redirects"

const responseStatus = [
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
}

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
  // @ts-ignore: not used now
  const { nextUrl } = req
  const remoteAddress = req.ip || getIp(req) || "-"
  const remoteUser = "-"
  const date = new Date().toISOString()
  const method = req.method
  const url = req.url
  const referrer = req.headers.get("referer") || "-"
  const userAgent = req.headers.get("user-agent") || "-"

  const status = res.status
  const httpVersion = "HTTP/1.1"
  const resContentLength = res.headers.get("content-length") || "-"

  const color = styles[responseStatusToColor(status)]
  const log = `${remoteAddress} ${remoteUser} [${date}] "${color.open}${method} ${url} ${httpVersion}${color.close}" ${status} ${resContentLength} "${referrer}" "${userAgent}"`

  const logFunction = status >= 400 ? console.error : console.log
  logFunction(log)
  // console.log(request.nextUrl)
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

const middlewares = [redirectMiddleware, loggerMiddleware]

export async function middleware(req: NextRequest) {
  let response = NextResponse.next()

  for (const mw of middlewares) {
    response = await mw(req, response)
  }
  return response
}

export const config = {
  // TODO: make this per middleware
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}
