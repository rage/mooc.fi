"use strict"
var axios = require("axios")
function getPassedUsernamesByTag(tag) {
  return __awaiter(this, void 0, void 0, function () {
    var res, usernames
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            axios.get(
              process.env.QUIZNATOR_HOST +
                "/api/v1/course-state/completed?courseIds=" +
                tag,
              {
                headers: {
                  Authorization: "Bearer " + process.env.QUIZNATOR_TOKEN,
                },
              },
            ),
          ]
        case 1:
          res = _a.sent()
          usernames = res.data
          return [2 /*return*/, usernames]
      }
    })
  })
}
module.exports = {
  getPassedUsernamesByTag: getPassedUsernamesByTag,
}
//# sourceMappingURL=quiznator.js.map
