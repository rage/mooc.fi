//import TmcClient from "tmc-client-js"
import { NextPageContext as NextContext } from "next"
import nookies from "nookies"
import { ApolloClient } from "@apollo/client"
import axios from "axios"
import Router from "next/router"

import {
  getToken,
  removeToken,
  getAccessToken as _getAccessToken,
} from "../packages/moocfi-auth"

/*
const tmcClient = new TmcClient(
  "59a09eef080463f90f8c2f29fbf63014167d13580e1de3562e57b9e6e4515182",
  "2ddf92a15a31f87c1aabb712b7cfd1b88f3465465ec475811ccce6febb1bad28",
)
*/

export const isSignedIn = (ctx: NextContext) => {
  const accessToken = nookies.get(ctx)["access_token"]
  return typeof accessToken == "string"
}

export const isAdmin = (ctx: NextContext) => {
  const admin = nookies.get(ctx)["admin"]
  return admin === "true"
}

const client_id = "7g5Llw"
const grant_type = "password"
const response_type = "token"
const domain = "localhost"
const priority = "tmc"

interface SignInProps {
  email: string
  password: string
  redirect?: boolean
  shallow?: boolean
}

export const signIn = async ({
  email,
  password,
  redirect = true,
  shallow = true,
}: SignInProps) => {
  //const res = await tmcClient.authenticate({ username: email, password })
  const res = await (<any>getToken({
    client_id,
    grant_type,
    response_type,
    domain,
    email,
    password,
    priority,
  }))
  const details = await userDetails(res.tmc_token)

  //document.cookie = `access_token=${res.accessToken};path=/`

  //document.cookie = `admin=${details.administrator};path=/`

  const rawRedirectLocation = nookies.get()["redirect-back"]

  if (redirect && (!rawRedirectLocation || rawRedirectLocation === "")) {
    window.history.back()
    return details
  }

  try {
    const { as, href } = JSON.parse(rawRedirectLocation)

    if (redirect) {
      setTimeout(() => {
        if (as && href) {
          Router.push(href, as, { shallow })
        } else {
          window.history.back()
        }
      }, 200)
    }
  } catch (e) {
    // Mostly to catch invalid JSON in the cookie
    console.error("Redirecting back failed because of", e)
    Router.push("/", undefined, { shallow })
  }

  return details
}

export const signOut = async (apollo: ApolloClient<any>, cb: any) => {
  await removeToken("tmc")
  document.cookie =
    "access_token" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/"
  document.cookie = "admin" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/"
  // Give browser a moment to react to the change
  setTimeout(() => {
    cb()
    setTimeout(() => {
      apollo.resetStore()
    }, 100)
  }, 100)
}

const getCookie = (key: string) => {
  if (typeof document === "undefined" || !document || !document?.cookie) {
    return
  }

  const vals = document.cookie
    .split("; ")
    .reduce<{ [key: string]: string }>((acc, curr) => {
      try {
        const [key, value] = curr.split("=")

        return {
          ...acc,
          [key]: value,
        }
      } catch (e) {
        //
      }

      return acc
    }, {})

  return vals[key] || ""
}

export const getAccessToken = async (ctx: NextContext | undefined) => {
  const access_token = await _getAccessToken()

  if (!ctx) {
    return getCookie("access_token")
  }

  return access_token
  //return nookies.get(ctx)["access_token"]
}

export async function userDetails(accessToken: string) {
  const res = await axios.get(
    `https://tmc.mooc.fi/api/v8/users/current?show_user_fields=true`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return res.data
}
