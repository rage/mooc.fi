"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
var lodash_1 = require("lodash")
var tmc_1 = tslib_1.__importDefault(require("../services/tmc"))
var prisma_1 = tslib_1.__importDefault(require("./lib/prisma"))
var tmc = new tmc_1["default"]()
var prisma = prisma_1["default"]()
var doIt = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var data, x, counter, i, existing, y, z, i
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, tmc.getUserAppDatum(null)]
        case 1:
          data = _a.sent()
          console.log(data)
          x = data.filter(function (p) {
            return (
              p.namespace === "elements-of-ai" &&
              p.field_name == "language" &&
              p.value == "se"
            )
          })
          x = lodash_1.uniqBy(x, function (p) {
            return p.user_id
          })
          console.log(x.length)
          counter = 0
          i = 0
          _a.label = 2
        case 2:
          if (!(i < x.length)) return [3 /*break*/, 5]
          return [
            4 /*yield*/,
            prisma.completion.findMany({
              where: {
                user_upstream_id: x[i].user_id,
                course: { slug: "elements-of-ai" },
              },
            }),
            /*const exists = await prisma.$exists.completion({
                      user_upstream_id: x[i].user_id,
                      course: { slug: "elements-of-ai" },
                    })*/
          ]
        case 3:
          existing = _a.sent()
          /*const exists = await prisma.$exists.completion({
                  user_upstream_id: x[i].user_id,
                  course: { slug: "elements-of-ai" },
                })*/
          if (existing.length > 0) counter++
          _a.label = 4
        case 4:
          i++
          return [3 /*break*/, 2]
        case 5:
          console.log(counter)
          y = data.filter(function (p) {
            return (
              p.namespace === "elements-of-ai" &&
              p.field_name == "language" &&
              p.value == "en"
            )
          })
          z = data
            .filter(function (p) {
              return (
                p.namespace === "elements-of-ai" &&
                p.field_name == "country" &&
                p.value == "Sweden"
              )
            })
            .map(function (p) {
              return p.user_id
            })
          counter = 0
          for (i = 0; i < y.length; i++) {
            if (z.includes(y[i].user_id)) counter++
          }
          console.log(counter)
          return [2 /*return*/]
      }
    })
  })
}
doIt()["catch"](function (e) {
  return console.log(e)
})
//# sourceMappingURL=parseFile.js.map
