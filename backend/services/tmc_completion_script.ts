import axios from "axios"

let _accessToken: string | null = null

async function fetchAccessToken(): Promise<string> {
  console.log("Fetching tmc access token...")
  try {
    const response = await axios.post(
      `${process.env.TMC_HOST}/oauth/token`,
      `client_secret=${
        process.env.TMC_CLIENT_SECRET
      }&username=${encodeURIComponent(
        process.env.TMC_USERNAME || "",
      )}&password=${encodeURIComponent(
        process.env.TMC_PASSWORD || "",
      )}&grant_type=password`,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
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
    `${process.env.TMC_HOST}/api/v8/users/basic_info_by_usernames?extra_fields=elements-of-ai&user_fields=1`,
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
