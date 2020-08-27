"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var axios_1 = tslib_1.__importDefault(require("axios"))
var luxon_1 = require("luxon")
var lodash_1 = require("lodash")
var prisma_1 = tslib_1.__importDefault(require("./lib/prisma"))
var logger_1 = tslib_1.__importDefault(require("./lib/logger"))
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
var prisma = prisma_1["default"]()
var logger = logger_1["default"]({ service: "fetch-avoin-links" })
var fetch = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var avoinObjects, _loop_1, _i, avoinObjects_1, p
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.openUniversityRegistrationLink.findMany({}),
          ]
        case 1:
          avoinObjects = _a.sent()
          _loop_1 = function (p) {
            var res, now, alternatives, openLinks, bestLink, url_1
            return tslib_1.__generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  logger.info("Processing link", p.course_code, p.language)
                  if (!p.course_code) {
                    logger.info(
                      "Since this link has no course code, I won't try to fetch new links.",
                    )
                    return [2 /*return*/, "continue"]
                  }
                  return [
                    4 /*yield*/,
                    getInfoWithCourseCode(p.course_code)["catch"](function (
                      error,
                    ) {
                      logger.error(error)
                      throw error
                    }),
                  ]
                case 1:
                  res = _a.sent()
                  logger.info(
                    "Open university info: ",
                    JSON.stringify(res, undefined, 2),
                  )
                  now = luxon_1.DateTime.fromJSDate(new Date())
                  alternatives = res.map(function (data) {
                    var linkStartDate = luxon_1.DateTime.fromISO(data.alkupvm)
                    var linkStopDate = luxon_1.DateTime.fromISO(data.loppupvm)
                    return {
                      link: data.oodi_id,
                      stopDate: linkStopDate,
                      startTime: linkStartDate,
                    }
                  })
                  openLinks = alternatives.filter(function (o) {
                    return o.startTime < now && o.stopDate > now
                  })
                  bestLink = lodash_1.maxBy(openLinks, function (o) {
                    return o.stopDate
                  })
                  if (!bestLink) {
                    logger.warn("Did not find any open links")
                    return [2 /*return*/, "continue"]
                  }
                  logger.info(
                    "Best link found was: " + JSON.stringify(bestLink),
                  )
                  url_1 =
                    "https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=" +
                    bestLink.link
                  logger.info("Updating link to", url_1)
                  return [
                    4 /*yield*/,
                    prisma.openUniversityRegistrationLink.update({
                      where: {
                        id: p.id,
                      },
                      data: {
                        link: url_1,
                        start_date: bestLink.startTime.toJSDate(),
                        stop_date: bestLink.stopDate.toJSDate(),
                      },
                    }),
                  ]
                case 2:
                  _a.sent()
                  return [2 /*return*/]
              }
            })
          }
          ;(_i = 0), (avoinObjects_1 = avoinObjects)
          _a.label = 2
        case 2:
          if (!(_i < avoinObjects_1.length)) return [3 /*break*/, 5]
          p = avoinObjects_1[_i]
          return [5 /*yield**/, _loop_1(p)]
        case 3:
          _a.sent()
          _a.label = 4
        case 4:
          _i++
          return [3 /*break*/, 2]
        case 5:
          return [2 /*return*/]
      }
    })
  })
}
var getInfoWithCourseCode = function (course_code) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var url, res
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          url = process.env.AVOIN_COURSE_URL + course_code
          return [
            4 /*yield*/,
            axios_1["default"].get(url, {
              headers: { Authorized: "Basic " + process.env.AVOIN_TOKEN },
            }),
          ]
        case 1:
          res = _a.sent()
          return [4 /*yield*/, res.data]
        case 2:
          return [2 /*return*/, _a.sent()]
      }
    })
  })
}
fetch()["catch"](function (error) {
  logger.error(error)
  throw error
})
//# sourceMappingURL=fetchAvoinLinks.js.map
