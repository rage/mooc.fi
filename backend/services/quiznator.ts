import { QUIZNATOR_HOST, QUIZNATOR_TOKEN } from "../config"

const axios = require("axios")

async function getPassedUsernamesByTag(tag: string) {
  const res = await axios.get(
    `${QUIZNATOR_HOST}/api/v1/course-state/completed?courseIds=${tag}`,
    {
      headers: { Authorization: "Bearer " + QUIZNATOR_TOKEN },
    },
  )
  const usernames = res.data
  return usernames
}

module.exports = {
  getPassedUsernamesByTag: getPassedUsernamesByTag,
}
