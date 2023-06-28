const fs = require("fs")
const path = require("path")

const DIRECTORY = "translations"
const IGNORED_FILES = []
const OUTPUT_FILE = "index.ts"
const PATTERN = /^(en|fi|se)\.ts$/
// @ts-ignore: not used for now
const capitalize = (str) => str[0].toUpperCase() + str.slice(1)
const camelCase = (str) => str.split("-").map(capitalize).join("")

const traverse = (dir) => {
  const files = fs.readdirSync(dir)

  const data = files
    .filter(
      (filename) =>
        !IGNORED_FILES.includes(filename) && filename !== OUTPUT_FILE,
    )
    .map((filename) => {
      const fullname = `${dir ? dir + "/" : ""}${filename}`
      const basename = path.parse(filename).name
      if (fs.statSync(fullname).isDirectory()) {
        const res = traverse(fullname)
        const imports = (res ?? [])
          .filter((entry) => PATTERN.test(entry?.filename))
          .map(
            ({ basename, filename }) =>
              `import ${basename} from "./${basename}"`,
          )
          .join("\n")
        if (imports.length === 0) {
          return
        }
        const languages = res.map((r) => r.basename)
        const typename = camelCase(basename)
        const exports = `${imports}\n
import { TranslationDictionary } from "/translations"\n
export type ${typename} = ${languages
          .map((lang) => `typeof ${lang}`)
          .join(" | ")}\n
const ${typename}Translations = { ${languages.join(
          ", ",
        )} } as TranslationDictionary<${typename}, { ${languages
          .map((lang) => `${lang}: typeof ${lang}`)
          .join(", ")} }>\n
export default ${typename}Translations\n`

        outputExports(exports, fullname)
      }

      return { basename, filename }
    })

  return data
}

const outputExports = (exports, dir) => {
  const exportFileContents = `// generated ${new Date()}\n\n${exports}`
  const exportFile = `${dir ? dir + "/" : ""}${OUTPUT_FILE}`
  if (dir !== DIRECTORY) {
    fs.writeFileSync(exportFile, exportFileContents)
    console.log("wrote", exportFile)
  }
}

const rootExports = traverse(DIRECTORY)
outputExports(rootExports, DIRECTORY)
