import axios from "axios"
import * as winston from "winston"

import {
  RATELIMIT_PROTECTION_SAFE_API_KEY,
  TMC_CLIENT_ID,
  TMC_CLIENT_SECRET,
  TMC_HOST,
  TMC_PASSWORD,
  TMC_USERNAME,
} from "../config"
import { OrganizationInfo, UserInfo } from "../domain/UserInfo"

export interface UserFieldValue {
  id: number
  user_id: number
  field_name: string
  value: string
  created_at: string
  updated_at: string
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "tmc" },
  transports: [new winston.transports.Console()],
})

let _accessToken: string | null = null

async function fetchAccessToken(): Promise<string> {
  logger.info("Fetching tmc access token...")
  try {
    const response = await axios.post(
      `${TMC_HOST}/oauth/token`,
      `client_secret=${TMC_CLIENT_SECRET}&client_id=${TMC_CLIENT_ID}&username=${encodeURIComponent(
        TMC_USERNAME || "",
      )}&password=${encodeURIComponent(
        TMC_PASSWORD || "",
      )}&grant_type=password`,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "RATELIMIT-PROTECTION-SAFE-API-KEY":
            RATELIMIT_PROTECTION_SAFE_API_KEY,
        },
      },
    )

    return response.data.access_token
  } catch (error) {
    logger.error(error)
    return ""
  }
}

export async function getAccessToken() {
  if (_accessToken) {
    return _accessToken
  }
  _accessToken = await fetchAccessToken()
  return _accessToken
}

export async function getBasicInfoByUsernames(usernames: string[]) {
  const res = await axios.post(
    `${TMC_HOST}/api/v8/users/basic_info_by_usernames?extra_fields=elements-of-ai&user_fields=1`,
    {
      usernames: usernames,
    },
    {
      headers: { Authorization: `Bearer ${await getAccessToken()}` },
    },
  )
  return res.data
}

export default class TmcClient {
  accessToken: string | null

  constructor(accessToken: string | null = null) {
    this.accessToken = accessToken
  }

  async getCurrentUserDetails(): Promise<UserInfo> {
    const res = await axios.get(
      `${TMC_HOST}/api/v8/users/current?show_user_fields=1&extra_fields=1`,
      {
        headers: { Authorization: this.accessToken ?? "" },
      },
    )

    const userInfo = res.data

    return userInfo
  }

  async getUserDetailsById(id: Number): Promise<UserInfo> {
    const res = await axios.get(
      `${TMC_HOST}/api/v8/users/${id}?show_user_fields=1&extra_fields=1`,
      {
        headers: { Authorization: `Bearer ${await getAccessToken()}` },
      },
    )

    const userInfo = res.data
    return userInfo
  }

  async getOrganizations(): Promise<OrganizationInfo[]> {
    const res = await axios.get(`${TMC_HOST}/api/v8/org.json`, {
      headers: { Authorization: `Bearer ${await getAccessToken()}` },
    })
    return res.data
  }

  async getUserAppDatum(after: string | null): Promise<any[]> {
    let res
    if (after != null) {
      after = await encodeURI(after)
      res = await axios.get(
        `${TMC_HOST}/api/v8/user_app_datum?after=${after}`,
        {
          headers: { Authorization: `Bearer ${await getAccessToken()}` },
        },
      )
    } else {
      res = await axios.get(`${TMC_HOST}/api/v8/user_app_datum`, {
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
        `${TMC_HOST}/api/v8/user_field_value?after=${after}`,
        {
          headers: { Authorization: `Bearer ${await getAccessToken()}` },
        },
      )
    } else {
      res = await axios.get(`${TMC_HOST}/api/v8/user_field_value`, {
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
    `${TMC_HOST}/api/v8/users/current?show_user_fields=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )

  const userInfo = res.data
  return userInfo
}
