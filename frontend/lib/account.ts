//import { v4 as uuidv4 } from "uuid"
import { getAccessToken } from "/lib/authentication"
import { createUser } from "../packages/moocfi-auth"
import { DOMAIN, isProduction } from "/config"
import axios from "axios"

const BASE_URL = "https://tmc.mooc.fi/"

export async function createAccount(data: any) {
  return await createUser({
    email: data.email,
    password: data.password,
    confirmPassword: data.password_confirmation,
    extra_fields: {},
    user_fields: {
      first_name: data.first_name,
      last_name: data.last_name,
    },
    origin: "mooc.fi",
    provider: "native",
    language: "fi",
    domain: isProduction ? DOMAIN : "localhost",
    priority: "tmc",
  })
}

/*
export function createAccount(data: any) {
  data.username = uuidv4()
  const body = {
    user: data,
    user_field: {
      first_name: data.first_name,
      last_name: data.last_name,
    },
    origin: "mooc.fi",
    language: "fi",
  }
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/users`, {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((json) => {
        if (!json.success) {
          reject(json.errors)
        } else {
          resolve(json)
        }
      })
    })
  })
}
*/

interface CreateTMCAccountParams {
  email: string
  username: string
  password: string
  password_confirmation: string
  user_field?: UserField
}

interface CreateTMCAccountReturnValue {
  success: boolean
  token?: string | null
  error?: any
}

export interface UserInfo {
  id: number
  username: string
  email: string
  user_field: UserField
  extra_fields: ExtraFields
  administrator: boolean
  //password: string
}

export interface ExtraFields {}

export interface UserField {
  first_name: string
  last_name: string
  html1: string
  organizational_id: string
  course_announcements: boolean
}

export async function createTMCAccount({
  email,
  username,
  password,
  password_confirmation,
  user_field,
}: CreateTMCAccountParams): Promise<CreateTMCAccountReturnValue> {
  return await axios({
    method: "POST",
    url: `${BASE_URL}/api/v8/users`,
    data: JSON.stringify({
      user: { email, username, password, password_confirmation },
      user_field,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.data)
    .then((json) => {
      if (json.success) {
        return authenticateTMCUser(email, password)
      } else {
        return { success: false, token: null, error: json.errors }
      }
    })
    .catch((error) => {
      return { success: false, token: null, error }
    })
}

export const authenticateTMCUser = async (
  username: string,
  password: string,
): Promise<any> => {
  return await axios({
    method: "POST",
    url: `${BASE_URL}/api/v8/oauth/token`,
    data: JSON.stringify({
      username,
      password,
      grant_type: "password",
      client_id:
        "59a09eef080463f90f8c2f29fbf63014167d13580e1de3562e57b9e6e4515182",
      client_secret:
        "2ddf92a15a31f87c1aabb712b7cfd1b88f3465465ec475811ccce6febb1bad28",
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.data)
    .then((json) => {
      if (json.access_token) {
        return { success: true, token: json.access_token, error: null }
      } else {
        return { success: false, token: null, error: json }
      }
    })
    .catch((error) => {
      return { success: false, token: null, error }
    })
}

export const getUserDetails = async (
  accessToken: string,
): Promise<UserInfo> => {
  const res = await axios.get(
    `${BASE_URL}/api/v8/users/current?show_user_fields=1&extra_fields=1`,
    {
      headers: { Authorization: accessToken },
    },
  )

  return res.data
}

export async function updateAccount(firstName: string, lastName: string) {
  const accessToken = await getAccessToken(undefined)

  if (!accessToken) {
    throw new Error("not logged in?")
  }

  const res = await fetch(
    `${BASE_URL}/api/v8/users/current?show_user_fields=1&extra_fields=1`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error("error fetching existing user")
  }

  const existingUser = await res.json()

  const newUser = {
    ...existingUser,
    user_field: {
      ...existingUser.user_field,
      first_name: firstName,
      last_name: lastName,
    },
  }

  const newRes = await fetch(`${BASE_URL}/api/v8/users/${existingUser.id}`, {
    method: "PUT",
    body: JSON.stringify(newUser),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return await newRes.json()
}
