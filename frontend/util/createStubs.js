const fs = require("fs")
const path = require("path")

const PAGES_DIR = `pages`
const STUBBABLE_DIRECTORIES = ["[lng]"]
const IGNORED_FILES = [] // not used yet

const walkDir = (dir, list) => {
  const files = fs.readdirSync(dir)

  return files
    .filter((filename) => !IGNORED_FILES.includes(filename))
    .map((filename) => {
      const fileWithDir = dir + filename

      if (
        !STUBBABLE_DIRECTORIES.some((d) =>
          fileWithDir.includes(`${PAGES_DIR}/${d}`),
        )
      ) {
        return
      }

      if (fs.statSync(fileWithDir).isDirectory()) {
        walkDir(`${dir}${filename}/`, list)
      } else {
        list.push(path.normalize(dir + filename))
      }

      return list
    })
    .filter((v) => !!v)[0]
}

const createStubs = () => {
  const fileList = walkDir(`${PAGES_DIR}/`, [])

  fileList.map((file) =>
    STUBBABLE_DIRECTORIES.map((dir) => {
      const pathname = path.dirname(file.replace(`/${dir}`, ""))

      if (pathname !== PAGES_DIR) {
        try {
          fs.mkdirSync(pathname, { recursive: true })
        } catch (e) {
          // fail silently
        }
      }

      const exportFile = `// this is a generated export stub\n\nexport { default } from "/${file.replace(
        ".tsx",
        "",
      )}"\n`
      const exportFilename = file.replace(`/${dir}`, "")
      fs.writeFileSync(exportFilename, exportFile)

      console.log("generated", exportFilename)
    }),
  )
}

console.log("This script is now deprecated, exiting...")
process.exit(1)

createStubs()
