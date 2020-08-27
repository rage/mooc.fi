"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var fs = tslib_1.__importStar(require("fs"))
var path = tslib_1.__importStar(require("path"))
var data = {
  "resolvers/Completion": "%name%",
  "resolvers/Mutation": "add%name%Mutations",
  "resolvers/Query": "add%name%Queries",
  types: "%name%",
}
var IGNORED_FILES = ["index.ts", "mimetypes.d.ts"]
var OUTPUT_FILE = "index.ts"
var capitalize = function (str) {
  return str[0].toUpperCase() + str.slice(1)
}
var createExports = function (dir, pattern) {
  var files = fs.readdirSync(dir)
  return files
    .filter(function (filename) {
      return !IGNORED_FILES.includes(filename) && filename !== OUTPUT_FILE
    })
    .map(function (filename) {
      var basename = path.parse(filename).name
      var exportName = pattern.replace(
        "%name%",
        pattern[0] !== "%" ? capitalize(basename) : basename,
      )
      return (
        "export { default as " + exportName + ' } from "./' + basename + '"'
      )
    })
}
;(function () {
  Object.entries(data).map(function (_a) {
    var dir = _a[0],
      pattern = _a[1]
    var exports = createExports(dir, pattern)
    var exportFile = dir + "/" + OUTPUT_FILE
    var exportFileContents =
      "// generated " + new Date() + "\n\n" + exports.join("\n")
    fs.writeFileSync(exportFile, exportFileContents)
    console.log("wrote", exportFile)
  })
})()
//# sourceMappingURL=createExports.js.map
