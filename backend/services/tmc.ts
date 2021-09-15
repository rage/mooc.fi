import axios from "axios"

import { OrganizationInfo, UserInfo } from "../domain/UserInfo"
import { getAccessToken } from "./tmc_completion_script"

require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

const BASE_URL = process.env.TMC_HOST || ""

export interface UserFieldValue {
  id: number
  user_id: number
  field_name: string
  value: string
  created_at: string
  updated_at: string
}

export default class TmcClient {
  accessToken: String | null

  constructor(accessToken: String | null = null) {
    this.accessToken = accessToken
  }

  async getCurrentUserDetails(): Promise<UserInfo> {
    const res = await axios.get(
      `${BASE_URL}/api/v8/users/current?show_user_fields=1&extra_fields=1`,
      {
        headers: { Authorization: this.accessToken },
      },
    )

    const userInfo = res.data

    return userInfo
  }

  async getUserDetailsById(id: Number): Promise<UserInfo> {
    const res = await axios.get(
      `${BASE_URL}/api/v8/users/${id}?show_user_fields=1&extra_fields=1`,
      {
        headers: { Authorization: `Bearer ${await getAccessToken()}` },
      },
    )

    const userInfo = res.data
    return userInfo
  }

  async getOrganizations(): Promise<OrganizationInfo[]> {
    const res = await axios.get(`${BASE_URL}/api/v8/org.json`, {
      headers: { Authorization: `Bearer ${await getAccessToken()}` },
    })
    return res.data
  }

  async getUserAppDatum(after: string | null): Promise<any[]> {
    let res
    if (after !== null) {
      after = await encodeURI(after)
      res = await axios.get(
        `${BASE_URL}/api/v8/user_app_datum?after=${after}`,
        {
          headers: { Authorization: `Bearer ${await getAccessToken()}` },
        },
      )
    } else {
      res = await axios.get(`${BASE_URL}/api/v8/user_app_datum`, {
        headers: { Authorization: `Bearer ${await getAccessToken()}` },
      })
    }
    return res.data
  }

  async getUserFieldValues(after: string | null): Promise<UserFieldValue[]> {
    let res
    if (after != null) {
      after = await encodeURI(after)
      res = await axios.get(
        `${BASE_URL}/api/v8/user_field_value?after=${after}`,
        {
          headers: { Authorization: `Bearer ${await getAccessToken()}` },
        },
      )
    } else {
      res = await axios.get(`${BASE_URL}/api/v8/user_field_value`, {
        headers: { Authorization: `Bearer ${await getAccessToken()}` },
      })
    }
    return res.data
  }
}

export const getCurrentUserDetails = async (
  accessToken: string,
): Promise<UserInfo> => {
  const res = await axios.get(
    `${BASE_URL}/api/v8/users/current?show_user_fields=1&extra_fields=1`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )

  const userInfo = res.data
  return userInfo
}

export const createUser = async (
  email: string,
  username: string,
  password: string,
  password_confirmation: string,
): Promise<{
  success: boolean
  token: string | null
  error: object | null
}> => {
  return await axios({
    method: "POST",
    url: `${BASE_URL}/api/v8/users`,
    data: JSON.stringify({
      user: { email, username, password, password_confirmation },
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.data)
    .then(async (json) => {
      if (json.success) {
        return await authenticateUser(email, password)
      } else {
        return { success: false, token: null, error: json.errors }
      }
    })
    .catch((error) => {
      return { success: false, token: null, error }
    })
}

export const authenticateUser = async (
  username: string,
  password: string,
): Promise<{
  success: boolean
  token: string | null
  error: object | null
}> => {
  console.log("will authenticate with ")
  return await axios({
    method: "POST",
    url: `${BASE_URL}/oauth/token`,
    data: JSON.stringify({
      username,
      password,
      grant_type: "password",
      client_id: process.env.TMC_CLIENT_ID,
      client_secret: process.env.TMC_CLIENT_SECRET,
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

export const resetUserPassword = async (email: string): Promise<any> => {
  if (email === "e@mail.com") {
    return { success: true }
  }

  return await axios({
    method: "POST",
    url: `${BASE_URL}/api/v8/users/password_reset`,
    data: JSON.stringify({ email }),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.data)
    .then((json) => json)
    .catch((error) => error)
}

export const updateUser = async (
  id: Number,
  user: any,
  token: string,
): Promise<any> => {
  return await axios({
    method: "PUT",
    url: `${BASE_URL}/api/v8/users/${id}`,
    data: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.data)
    .then((json) => json)
    .catch((error) => error)
}

export const getUsersByEmail = async (
  emails: string[],
): Promise<UserInfo[]> => {
  return await axios.post(
    `${BASE_URL}/api/v8/users/basic_info_by_emails`,
    { emails },
    {
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${await getAccessToken()}`, // TODO: needs admin token
      },
    },
  )
}
