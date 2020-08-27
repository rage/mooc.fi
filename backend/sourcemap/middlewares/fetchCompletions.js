"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var db_functions_1 = require("/util/db-functions")
function fetchCompletions(args, ctx) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var course, startTime, data, stopTime
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          course = args.course
          startTime = new Date().getTime()
          return [4 /*yield*/, getCompletionDataFromDB(args, ctx)]
        case 1:
          data = _a.sent()
          console.log("FINISHED WITH", course)
          stopTime = new Date().getTime()
          console.log("used", stopTime - startTime, "time")
          return [2 /*return*/, data]
      }
    })
  })
}
exports["default"] = fetchCompletions
function getCompletionDataFromDB(_a, ctx) {
  var course = _a.course,
    first = _a.first,
    after = _a.after,
    last = _a.last,
    before = _a.before,
    skip = _a.skip
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var courseObject
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [
            4 /*yield*/,
            ctx.db.course.findOne({ where: { slug: course } }),
          ]
        case 1:
          courseObject = _b.sent()
          return [
            2 /*return*/,
            ctx.db.completion.findMany(
              tslib_1.__assign(
                tslib_1.__assign(
                  {},
                  db_functions_1.convertPagination({
                    first: first,
                    after: after,
                    last: last,
                    before: before,
                    skip: skip,
                  }),
                ),
                {
                  where: {
                    course: {
                      id:
                        courseObject === null || courseObject === void 0
                          ? void 0
                          : courseObject.id,
                    },
                  },
                },
              ),
            ),
          ]
      }
    })
  })
}
//# sourceMappingURL=fetchCompletions.js.map
