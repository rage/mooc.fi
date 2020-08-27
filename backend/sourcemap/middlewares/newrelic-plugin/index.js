"use strict"
exports.__esModule = true
exports.newrelicPlugin = void 0
exports.newrelicPlugin = function () {
  return {
    packageJsonPath: require.resolve("../../package.json"),
    runtime: {
      module: require.resolve("./runtime"),
      export: "plugin",
    },
  }
}
//# sourceMappingURL=index.js.map
