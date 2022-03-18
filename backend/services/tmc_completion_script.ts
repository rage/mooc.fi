import axios from "axios"

import {
  RATELIMIT_PROTECTION_SAFE_API_KEY,
  TMC_CLIENT_ID,
  TMC_CLIENT_SECRET,
  TMC_HOST,
  TMC_PASSWORD,
  TMC_USERNAME,
} from "../config"

let _accessToken: string | null = null

async function fetchAccessToken(): Promise<string> {
  console.log("Fetching tmc access token...")
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
          "RATELIMIT-PROTECTION-SAFE-API-KEY": RATELIMIT_PROTECTION_SAFE_API_KEY,
        },
      },
    )

    return response.data.access_token
  } catch (error) {
    console.log(error)
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

async function getBasicInfoByUsernames(usernames: string[]) {
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

module.exports = {
  getAccessToken: getAccessToken,
  getBasicInfoByUsernames: getBasicInfoByUsernames,
}
