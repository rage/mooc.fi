"use strict"
exports.__esModule = true
var lodash_1 = require("lodash")
var crypto_1 = require("crypto")
exports["default"] = function (user) {
  return crypto_1
    .createHash("sha512")
    .update(
      Object.values(
        lodash_1.pick(user, [
          "upstream_id",
          "administrator",
          "email",
          "first_name",
          "last_name",
          "username",
        ]),
      ).join("-"),
    )
    .digest("hex")
}
//# sourceMappingURL=hashUser.js.map
