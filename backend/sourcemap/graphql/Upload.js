"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var apollo_server_core_1 = require("apollo-server-core")
var nexus_1 = require("nexus")
nexus_1.schema.scalarType(
  tslib_1.__assign(tslib_1.__assign({}, apollo_server_core_1.GraphQLUpload), {
    rootTyping: "UploadRoot",
  }),
)
//# sourceMappingURL=Upload.js.map
