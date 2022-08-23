import * as fs from "fs"
import * as path from "path"

const DIRECTORY = "graphql"
const IGNORED_FILES: string[] = ["__test__", "common"]
const OUTPUT_FILE = "index.ts"

// @ts-ignore: not used for now
const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)

const createExports = (dir: string): string[] => {
  const files = fs.readdirSync(dir)

  return files
    .filter(
      (filename) =>
        !IGNORED_FILES.includes(filename) && filename !== OUTPUT_FILE,
    )
    .map((filename) => {
      const fullname = `${dir ? dir + "/" : ""}${filename}`

      if (fs.statSync(fullname).isDirectory()) {
        const exports = createExports(fullname)
        outputExports(exports, fullname)
      }

      const basename = path.parse(filename).name
      return `export * from "./${basename}"`
    })
}

const outputExports = (exports: string[], dir: string) => {
  const exportFileContents = `// generated ${new Date()}\n\n${exports.join(
    "\n",
  )}`
  const exportFile = `${dir ? dir + "/" : ""}${OUTPUT_FILE}`
  fs.writeFileSync(exportFile, exportFileContents)
  console.log("wrote", exportFile)
}

const rootExports = createExports(DIRECTORY)
outputExports(rootExports, DIRECTORY)
