import axios from "axios"
import { UserInfo, OrganizationInfo } from "../domain/UserInfo"
import { getAccessToken } from "./tmc_completion_script"

const BASE_URL = "https://tmc.mooc.fi"

export default class TmcClient {
  accessToken: String
  constructor(accessToken: String = null) {
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

  async getUserAppDatum(after: string): Promise<any[]> {
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
}
