require("dotenv-safe").config();
const nodemailer = require("nodemailer");
const getPassedUsernamesByTag = require("../services/quiznator")
  .getPassedUsernamesByTag;
const tmcService = require("../services/tmc_completion_script");
const exec = require("child_process").exec;
const axios = require("axios");
var fs = require("fs");
const Prisma = require("../generated/prisma-client")

const username = process.env.MAIL_USERNAME;
const password = process.env.MAIL_PASSWORD;

let smtpConfig = {
  host: "mail.cs.helsinki.fi",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: username,
    pass: password
  }
};

const tags = ["elements-of-ai", "elements-of-ai-fi"];

let transporter = nodemailer.createTransport(smtpConfig);

const date = new Date();
var _longDate = new Date().toISOString();
const dateDescription = _longDate.substring(0, _longDate.indexOf("T"));

export async function doIt() {
  const tagsToInfo = await getTagsToInfo();
  //const csvs = await getAvoinCSVs(tagsToInfo);
  // await sendMail(csvs);
  //await sendMailToLuukkainen(tagsToInfo);
  console.log("DOING IT")
  return tagsToInfo
}

async function getAvoinCSVs(tagsToInfo) {
  const res = {}
  let all = []
  for (let a of Object.entries(tagsToInfo)) {
    const [tag, info] = a;
    all = all.concat(info);
    const csv = await processIgnoredAndReturnEmailsAvoinWants(info);
    res[tag] = csv;
  }
  res["elements-of-ai-all"] = makeCsv(all);
  return res
}

async function processIgnoredAndReturnEmailsAvoinWants(users) {
  let ignoredUsers = JSON.parse(fs.readFileSync("ignore-users.json"));

  console.log(`Loaded ${ignoredUsers.length} ignored users`);

  const notIgnoredUsers = users.filter(u => !ignoredUsers.includes(u.email));
  console.log(`We have ${notIgnoredUsers.length} not ignored users`);

  notIgnoredUsers.forEach(o => {
    ignoredUsers.push(o.email);
  });

  fs.writeFileSync("ignore-users.json", JSON.stringify(ignoredUsers, null, 2));

  const openUniversityUsers = notIgnoredUsers.filter(user => {
    if (user.extra_fields === undefined) {
      return true;
    }
    return user.extra_fields.open_university === "t";
  });

  console.log(
    `${
      openUniversityUsers.length
    } of not ignored users want to receive mail from open university`
  );

  const openUniversityCsvContents = makeCsv(openUniversityUsers);
  return openUniversityCsvContents;
}

async function getTagsToInfo() {
  let tagsToInfo = [];
  const promises = tags.map(async tag => {
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
    console.log("PUSHED")
  });
  await Promise.all(promises);
  console.log(tagsToInfo)
  return tagsToInfo;
}

async function parseCompletions(completions, tag) {
  console.log("START")
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
  console.log("STOP")
  return parsed
}

async function determineCompletionLanguage(tag) {
  switch(tag) {
    case "elements-of-ai":
      return "en_us"
    case "elements-of-ai-fi":
     return "fi_fi"
  }
 } 

function makeCsv(users) {
  let emails = users.map(o => o.email);
  let contents = "email\n";
  emails.forEach(email => {
    contents += `${email}\n`;
  });
  return contents;
}



//doIt();

// const FetchCompletions = async (resolve, root, args, context, info) => {
//   context.completions = doIt()
//   const result = await resolve(root, args, context, info);
//   return result
// }

//export default FetchCompletions

