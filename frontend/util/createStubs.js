const fs = require("fs")
const path = require("path")

const PAGES_DIR = `pages`
const STUBBABLE_DIRECTORIES = ["[lng]"]
const IGNORED_FILES = []

const walkDir = (dir, list) => {
  const files = fs.readdirSync(dir)

  files.forEach(f => {
    const fileWithDir = dir + f

    if (
      !STUBBABLE_DIRECTORIES.some(d =>
        fileWithDir.includes(`${PAGES_DIR}/${d}`),
      )
    ) {
      return
    }

    if (fs.statSync(fileWithDir).isDirectory()) {
      list = walkDir(`${dir}${f}/`, list)
    } else {
      list.push(path.normalize(dir + f))
    }
  })

  return list
}

const createStubs = () => {
  const fileList = walkDir(`${PAGES_DIR}/`, [])

  fileList.map(file =>
    STUBBABLE_DIRECTORIES.map(dir => {
      const stripped = file.replace(`/${dir}`, "")
      const pathname = path.dirname(stripped)

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

createStubs()
