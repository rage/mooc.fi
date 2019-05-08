const axios = require('axios')
const exec = require("child_process").exec;


async function getPassedUsernamesByTag(tag) {

  const res = await axios.get(
    `${
      process.env.QUIZNATOR_HOST
    }/api/v1/course-state/completed?courseIds=${tag}`,
    {
      headers: {"Authorization": "Bearer " + process.env.QUIZNATOR_TOKEN} 
    }
  )
  const usernames = res.data
  return usernames
}

module.exports = {
  getPassedUsernamesByTag: getPassedUsernamesByTag
};

