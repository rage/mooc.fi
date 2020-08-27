"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var tmc_1 = tslib_1.__importDefault(require("../../../services/tmc"))
var getUserFromTMC = function (prisma, user_id) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var tmc, userDetails
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          tmc = new tmc_1["default"]()
          return [4 /*yield*/, tmc.getUserDetailsById(user_id)]
        case 1:
          userDetails = _a.sent()
          return [
            2 /*return*/,
            prisma.user.create({
              data: {
                upstream_id: userDetails.id,
                first_name: userDetails.user_field.first_name,
                last_name: userDetails.user_field.last_name,
                email: userDetails.email,
                username: userDetails.username,
                administrator: userDetails.administrator,
              },
            }),
          ]
      }
    })
  })
}
exports["default"] = getUserFromTMC
//# sourceMappingURL=getUserFromTMC.js.map
