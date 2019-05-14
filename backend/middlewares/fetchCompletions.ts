require("dotenv-safe").config();
const getPassedUsernamesByTag = require("../services/quiznator")
  .getPassedUsernamesByTag;
const tmcService = require("../services/tmc_completion_script");
const { UserInputError } = require('apollo-server-core')



const elementsOfAiTags = ["elements-of-ai", "elements-of-ai-fi", "elements-of-ai-se"];


export async function doIt(course) {
  let info;
  if (course == "elements-of-ai"){
    info = await getElementsOfAiInfo()
  } else {
    info = await getCourseInfo(course)
  }
  return info
}


async function getCourseInfo(course) {
  let basicInfo
  const promise = async course => {
    const usernames = await getPassedUsernamesByTag(course)
    console.log(
      `Got passed students from quiznator! ${
        usernames.length
      } students have passed ${course} so far.`
    )
    basicInfo = await tmcService.getBasicInfoByUsernames(usernames);
    console.log(`Got info from ${basicInfo.length} ${course} students`);
    basicInfo = await parseCompletions(basicInfo, course)
  }
  await Promise.apply(promise)
  return basicInfo
}
async function getElementsOfAiInfo() {
  let tagsToInfo = [];
  const promises = elementsOfAiTags.map(async tag => {
    const usernames = await getPassedUsernamesByTag(tag);
    console.log(
      `Got passed students from quiznator! ${
        usernames.length
      } students have passed ${tag} so far.`
    );
    let basicInfo = await tmcService.getBasicInfoByUsernames(usernames);
    console.log(`Got info from ${basicInfo.length} ${tag} students`);
    basicInfo = await parseCompletions(basicInfo, tag)
    tagsToInfo.push(...basicInfo)
  });
  await Promise.all(promises);
  return tagsToInfo;
}

async function parseCompletions(completions, tag) {
  let parsed = []
  for (let i = 0; i < completions.length; i++) {
    let completion = {}
    let old = completions[i]
    completion["id"] = old.id
    completion["email"] = old.email
    completion["username"] = old.username
    completion["student_number"] = old.student_number
    completion["first_name"] = old.first_name
    completion["last_name"] = old.last_name
    completion["completion_language"] = determineCompletionLanguage(tag)
    parsed.push(completion)
  }
  return parsed
}

async function determineCompletionLanguage(tag) {
  switch(tag) {
    case "elements-of-ai":
      return "en_us"
    case "elements-of-ai-fi":
     return "fi_fi"
    case "elements-of-ai-se":
      return "sv_SE"
    default:
      return "undefined"
  }
 } 

