import { NextPageContext as NextContext } from "next"
import Router from "next/router"
import nookies from "nookies"

import { ApolloClient } from "@apollo/client"

export const isSignedIn = (ctx?: NextContext): boolean => {
  if (typeof window !== "undefined") {
    const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/)
    return Boolean(match?.[1])
  }
  const cookies = nookies.get(ctx)
  const accessToken = cookies["access_token"]
  return typeof accessToken === "string"
}

export const isAdmin = (ctx?: NextContext): boolean => {
  if (typeof window !== "undefined") {
    const match = document.cookie.match(/(?:^|; )admin=([^;]*)/)
    return match?.[1] === "true"
  }
  const cookies = nookies.get(ctx)
  const admin = cookies["admin"]
  return admin === "true"
}

/**
 * Makes a TMC access token the browser's session, as a password sign-in does. Also for tokens
 * issued on the user's behalf, such as by a courses.mooc.fi handoff.
 */
export const startSession = async (
  accessToken: string,
  apollo?: ApolloClient<object>,
  expiresInSeconds?: number | null,
) => {
  const details = await userDetails(accessToken)
  // Issued tokens expire, unlike password sign-ins; the session must not outlive its token.
  const maxAge = expiresInSeconds ? `;max-age=${expiresInSeconds}` : ""

  document.cookie = `access_token=${accessToken};path=/${maxAge}`
  document.cookie = `admin=${details.administrator};path=/${maxAge}`

  await apollo?.resetStore()

  return details
}

interface SignInProps {
  email: string
  password: string
  redirect?: boolean
  shallow?: boolean
}

export const signIn = async (
  { email, password, redirect = true, shallow = true }: SignInProps,
  apollo?: ApolloClient<object>,
  cb?: () => void,
) => {
  const { locale = "fi" } = Router
  const { default: TmcClient } = await import("tmc-client-js")
  const tmcClient = new TmcClient(
    "59a09eef080463f90f8c2f29fbf63014167d13580e1de3562e57b9e6e4515182",
    "2ddf92a15a31f87c1aabb712b7cfd1b88f3465465ec475811ccce6febb1bad28",
  )
  const res = await tmcClient.authenticate({ username: email, password })
  const details = await startSession(res.accessToken, apollo)

  cb?.()

  const rawRedirectLocation = nookies.get()["redirect-back"]
  // Spent once used, so a later sign-in does not jump back to this page.
  nookies.destroy(undefined, "redirect-back", { path: "/" })

  if (redirect && (!rawRedirectLocation || rawRedirectLocation === "")) {
    Router.back()
    return details
  }

  try {
    const { url } = JSON.parse(rawRedirectLocation)

    if (redirect) {
      setTimeout(() => {
        if (url) {
          Router.push(url, undefined, { shallow, locale })
        } else {
          Router.back()
        }
      }, 200)
    }
  } catch (e) {
    // Mostly to catch invalid JSON in the cookie
    console.error("Redirecting back failed because of", e)
    Router.push("/", undefined, { shallow, locale })
  }

  return details
}

/** Drops the session cookies without telling anyone; see {@link signOut} for the UI. */
export const clearSession = () => {
  document.cookie =
    "access_token" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/"
  document.cookie = "admin" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/"
}

export const signOut = async (apollo: ApolloClient<object>, cb: () => void) => {
  clearSession()
  // Give browser a moment to react to the change
  setTimeout(() => {
    cb()
    setTimeout(() => {
      apollo.resetStore()
    }, 100)
  }, 100)
}

export const getAccessToken = (ctx?: NextContext): string | undefined => {
  if (typeof window !== "undefined") {
    const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/)
    if (match?.[1]) {
      return match[1]
    }
  }
  const cookies = nookies.get(ctx)
  return cookies["access_token"]
}

interface UserInfo {
  id: string
  username: string
  mail: string
  administrator: boolean
}

export async function userDetails(accessToken: string): Promise<UserInfo> {
  const res = await fetch(
    `https://tmc.mooc.fi/api/v8/users/current?show_user_fields=true`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  if (res.ok) {
    return res.json()
  }
  return {} as UserInfo
}

/** Whether TMC turns the token down, as it does once the token expires or is revoked. */
export async function isAccessTokenRejected(accessToken: string) {
  try {
    const res = await fetch(`https://tmc.mooc.fi/api/v8/users/current`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.status === 401
  } catch {
    return false
  }
}
