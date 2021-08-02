import axios from "axios"
import Cookies from "universal-cookie"
import { FRONTEND_URL } from "../../config"
/*
const axios = require("axios")
const Cookies = require("universal-cookie")
*/

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? FRONTEND_URL // TODO: not actually the frontend url, but it's the same in production
    : "http://localhost:4000"

interface ExtraFields {
  namespace?: string
  data?: any
}

interface UserFields {
  organizational_id?: string
  first_name?: string
  last_name?: string
}

interface CreateFields {
  email: string
  password: string
  confirmPassword: string
  extra_fields: ExtraFields
  user_fields: UserFields
  origin?: string
  provider?: string
  language?: string
  domain?: string
  priority?: string
}

interface SetCookiesOptions {
  priority?: string | null
  accessToken: string
  tmcToken: string
  domain: string
  admin?: boolean
}

const setCookies = ({
  priority,
  accessToken,
  tmcToken,
  domain,
  admin,
}: SetCookiesOptions) => {
  const cookies = new Cookies()
  cookies.set("admin", admin, { domain })

  if (priority === "tmc") {
    cookies.set("mooc_token", accessToken, {
      domain,
    })
    cookies.set("access_token", tmcToken, {
      domain,
    })
  } else {
    cookies.set("access_token", accessToken, {
      domain,
    })
    cookies.set("tmc_token", tmcToken, {
      domain,
    })
  }
}

export const createUser = async (data: CreateFields) => {
  let origin = data.origin || "mooc.fi"
  let provider = data.provider || "native"
  let language = data.language || "en"
  let domain = data.domain || "localhost"
  let priority = data.priority || null

  return await axios({
    method: "POST",
    url: `${BASE_URL}/auth/signUp`,
    data: {
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      extra_fields: data.extra_fields,
      user_fields: data.user_fields,
      provider,
      origin,
      language,
    },
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.data)
    .then((json) => {
      setCookies({
        priority,
        accessToken: json.auth.access_token,
        tmcToken: json.auth.tmc,
        admin: json.auth.admin,
        domain,
      })

      return json
    })
    .then((error) => error)
}

interface Data {
  client_id: string
  grant_type: string
  response_type: string
  domain: string
  email?: string
  password?: string
  code?: string
  tmc?: string
  priority?: string
}

export const getToken = async (data: Data) => {
  return await axios({
    method: "POST",
    url: `${BASE_URL}/auth/token`,
    data: data,
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.data)
    .then((json) => {
      if (json.targetUri) {
        window.location.replace(json.targetUri)
      } else {
        setCookies({
          priority: data.priority,
          accessToken: json.access_token,
          tmcToken: json.tmc_token || data.tmc,
          admin: json.admin,
          domain: data.domain,
        })

        return {
          access_token: json.access_token,
          tmc_token: data.tmc || json.tmc_token,
        }
      }
    })
}

export const removeToken = async (priority: string) => {
  const cookies = new Cookies()

  return await axios({
    method: "POST",
    url: `${BASE_URL}/auth/signOut`,
    data: {},
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        priority === "tmc" ? await getMoocToken() : await getAccessToken()
      }`,
    },
  })
    .then((response) => response.data)
    .then((json) => {
      cookies.remove("access_token")
      cookies.remove("tmc_token")
      cookies.remove("mooc_token")
      cookies.remove("admin")

      return json
    })
    .catch((error) => {
      return error.response.data
    })
}

const getCookie = (field: string) => () => {
  const cookies = new Cookies()

  return cookies.get(field)
}

export const getAccessToken = getCookie("access_token")
export const getTMCToken = getCookie("tmc_token")
export const getMoocToken = getCookie("mooc_token")
export const getAdmin = getCookie("admin")
