const https = require("https")
const fs = require("fs")
const path = require("path")

function download(filename, url) {
  const file = fs.createWriteStream(filename)
  https
    .get(url, (res) => {
      res.pipe(file)
    })
    .on("error", (e) => {
      console.error("error downloading", e)
    })
}

console.log("Downloading BAI course env")
download(
  path.join(__dirname, "/kafkaConsumer/common/userCourseProgress/env.json"),
  "https://gist.githubusercontent.com/Technopathic/2443135b588895ff2b21631393eacdb6/raw/97f64a9926aba6313deb8dd85a1b00be9288c99b/env.json",
)
