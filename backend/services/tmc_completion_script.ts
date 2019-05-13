const exec = require("child_process").exec;
import axios from 'axios'
//const axios = require("axios");

console.log("Fetching tmc access token...");
let _accessToken = null;
console.log("Got tmc access token.");

function fetchAccessToken() {
  return new Promise((resolve, _reject) => {
    exec(
      `curl -fsS -XPOST $TMC_HOST/oauth/token --data-urlencode "client_id=${
        process.env.TMC_CLIENT_ID
      }" --data-urlencode "client_secret=${
        process.env.TMC_CLIENT_SECRET
      }" --data-urlencode "username=${
        process.env.TMC_USERNAME
      }" --data-urlencode "password=$TMC_PASSWORD" --data-urlencode "grant_type=password" | jq -r '.access_token'`,
      { maxBuffer: 1024 * 1000 },
      (err, accessToken) => {
        if (err) {
          console.error("Error while getting tmc access token");
          console.log(err)
          process.exit(1);
        }
        resolve(accessToken.trim());
      }
    );
  });
}

async function getAccessToken() {
  if (_accessToken) {
    return _accessToken;
  }
  _accessToken = await fetchAccessToken();
  return _accessToken
}

async function getBasicInfoByUsernames(usernames) {
  const res = await axios.post(
    `${
      process.env.TMC_HOST
    }/api/v8/users/basic_info_by_usernames?extra_fields=elements-of-ai&user_fields=1`,
    {
      usernames: usernames
    },
    {
      headers: { Authorization: `Bearer ${await getAccessToken()}` }
    }
  );
  return res.data
}

module.exports = {
  getAccessToken: getAccessToken,
  getBasicInfoByUsernames: getBasicInfoByUsernames
};

