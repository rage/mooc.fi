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
    `${BASE_URL}/api/v8/users/current?show_user_fields=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )

  const userInfo = res.data
  return userInfo
}
