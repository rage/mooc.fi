import * as fs from "fs"
import * as path from "path"

const data = {
  "resolvers/Completion": "%name%",
  "resolvers/Mutation": "add%name%Mutations",
  "resolvers/Query": "add%name%Queries",
  types: "%name%",
}

const IGNORED_FILES = ["index.ts"]
const OUTPUT_FILE = "index.ts"

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)

const createExports = (dir: string, pattern: string) => {
  const files = fs.readdirSync(dir)

  return files
    .filter(
      filename => !IGNORED_FILES.includes(filename) && filename !== OUTPUT_FILE,
    )
    .map(filename => {
      const basename = path.parse(filename).name
      const exportName = pattern.replace(
        "%name%",
        pattern[0] !== "%" ? capitalize(basename) : basename,
      )

      return `export { default as ${exportName} } from "./${basename}"`
    })
}
;(() => {
  Object.entries(data).map(([dir, pattern]) => {
    const exports = createExports(dir, pattern)

    const exportFile = `${dir}/${OUTPUT_FILE}`
    const exportFileContents = `// generated ${new Date()}\n\n${exports.join(
      "\n",
    )}`

    fs.writeFileSync(exportFile, exportFileContents)
    console.log("wrote", exportFile)
  })
})()
