"use strict"
exports.__esModule = true
exports.moocfiAuthPlugin = void 0
exports.moocfiAuthPlugin = function (settings) {
  return {
    settings: settings,
    packageJsonPath: require.resolve("../../package.json"),
    runtime: {
      module: require.resolve("./runtime"),
      export: "plugin",
    },
  }
}
//# sourceMappingURL=index.js.map
