const exec = require("child_process").exec
import axios from "axios"
//const axios = require("axios");

let _accessToken: string | null = null

function fetchAccessToken(): Promise<string> {
  return new Promise((resolve, _reject) => {
    console.log("Fetching tmc access token...")
    exec(
      `curl -fsS -XPOST $TMC_HOST/oauth/token --data-urlencode "client_id=${process.env.TMC_CLIENT_ID}" --data-urlencode "client_secret=${process.env.TMC_CLIENT_SECRET}" --data-urlencode "username=${process.env.TMC_USERNAME}" --data-urlencode "password=$TMC_PASSWORD" --data-urlencode "grant_type=password" | jq -r '.access_token'`,
      { maxBuffer: 1024 * 1000 },
      (err: any, accessToken: string) => {
        if (err) {
          console.error("Error while getting tmc access token")
          console.log(err)
          process.exit(1)
        }
        console.log("Got tmc access token.")
        resolve(accessToken.trim())
      },
    )
  })
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
