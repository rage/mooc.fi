import { NextPageContext as NextContext } from "next"
import Router from "next/router"
import nookies from "nookies"

import { ApolloClient } from "@apollo/client"

import { BACKEND_URL } from "./backendUrl"
import { isSafeRedirectPath } from "./redirectBack"

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

const authCookieAttributes = () =>
  `;path=/;SameSite=Lax${window.location.protocol === "https:" ? ";Secure" : ""}`

/**
 * Makes a TMC access token the browser's session, as a password sign-in does. Also for tokens
 * issued on the user's behalf, such as by a courses.mooc.fi handoff.
 *
 * The session lasts until the browser closes. Any session it replaces is revoked at TMC.
 */
export const startSession = async (
  accessToken: string,
  apollo?: ApolloClient,
) => {
  const details = await userDetails(accessToken)

  const replacedToken = getAccessToken()
  if (replacedToken && replacedToken !== accessToken) {
    revokeSession(replacedToken)
  }
  const cookieAttributes = authCookieAttributes()
  document.cookie = `access_token=${accessToken}${cookieAttributes}`
  document.cookie = `admin=${details.administrator}${cookieAttributes}`

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
  apollo?: ApolloClient,
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
        if (isSafeRedirectPath(url)) {
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

/**
 * Asks the backend to revoke the token at TMC, so it is useless after sign-out even if copied.
 * Never waits or fails: signing out must work while TMC is down.
 */
const revokeSession = (accessToken: string) => {
  fetch(`${BACKEND_URL}/api/sign-out`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    // Survives the navigation that usually follows a sign-out.
    keepalive: true,
  }).catch(() => undefined)
}

/**
 * Drops the session cookies without telling anyone, for a token TMC already rejects; see
 * {@link endSession} for one that may still work.
 */
export const clearSession = () => {
  const cookieAttributes = authCookieAttributes()
  document.cookie = `access_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT${cookieAttributes}`
  document.cookie = `admin=; expires=Thu, 01 Jan 1970 00:00:01 GMT${cookieAttributes}`
}

/** Drops the session and revokes its token at TMC; see {@link signOut} for the UI. */
export const endSession = () => {
  const accessToken = getAccessToken()
  if (accessToken) {
    revokeSession(accessToken)
  }
  clearSession()
}

export const signOut = async (apollo: ApolloClient, cb: () => void) => {
  endSession()
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
