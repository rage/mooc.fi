import axios from "axios"
import { UserInfo, OrganizationInfo } from "../domain/UserInfo"
import { getAccessToken } from "./tmc_completion_script"

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
    if (after != null) {
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
): Promise<any> => {
  return await axios({
    method: "POST",
    url: `${BASE_URL}/api/v8/users`,
    data: JSON.stringify({
      user: { email, username, password, password_confirmation },
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.data)
    .then((json) => {
      if (json.success) {
        return authenticateUser(email, password)
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
): Promise<any> => {
  return await axios({
    method: "POST",
    url: `${BASE_URL}/oauth/token`,
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
