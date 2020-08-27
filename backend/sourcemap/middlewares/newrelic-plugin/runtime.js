"use strict"
exports.__esModule = true
exports.plugin = void 0
var schema_1 = require("./lib/schema")
exports.plugin = function () {
  return function (_project) {
    return {
      schema: {
        plugins: [schema_1.newrelicPlugin()],
      },
    }
  }
}
//# sourceMappingURL=runtime.js.map
