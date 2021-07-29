import axios from "axios"
import Cookies from "universal-cookie"

/*
const axios = require("axios")
const Cookies = require("universal-cookie")
*/

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://mooc.fi"
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

export const createUser = async (data: CreateFields) => {
  const cookies = new Cookies()
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
      if (priority === "tmc") {
        cookies.set("mooc_token", JSON.stringify(json.auth.access_token), {
          domain: domain,
        })
        cookies.set("access_token", JSON.stringify(json.auth.tmc), {
          domain: domain,
        })
      } else {
        cookies.set("access_token", JSON.stringify(json.auth.access_token), {
          domain: domain,
        })
        cookies.set("tmc_token", JSON.stringify(json.auth.tmc), {
          domain: domain,
        })
      }

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
  const cookies = new Cookies()

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
        if (data.priority === "tmc") {
          cookies.set("mooc_token", JSON.stringify(json.access_token), {
            domain: data.domain,
          })
          cookies.set(
            "access_token",
            JSON.stringify(json.tmc_token || data.tmc),
            { domain: data.domain },
          )
        } else {
          cookies.set("access_token", JSON.stringify(json.access_token), {
            domain: data.domain,
          })
          cookies.set("tmc_token", JSON.stringify(json.tmc_token || data.tmc), {
            domain: data.domain,
          })
        }

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
      return json
    })
    .catch((error) => {
      return error.response.data
    })
}

export const getAccessToken = () => {
  const cookies = new Cookies()
  let access_token = cookies.get("access_token")

  return access_token
}

export const getTMCToken = () => {
  const cookies = new Cookies()
  let tmc_token = cookies.get("tmc_token")

  return tmc_token
}

export const getMoocToken = () => {
  const cookies = new Cookies()
  let mooc_token = cookies.get("mooc_token")

  return mooc_token
}
