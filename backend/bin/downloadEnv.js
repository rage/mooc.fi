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
  path.join(__dirname, "../config/env.json"),
  "https://gist.githubusercontent.com/Technopathic/2443135b588895ff2b21631393eacdb6/raw/49e796efd23a8bc1f72b24d5f3b8b3f90667c64f/env.json",
)
