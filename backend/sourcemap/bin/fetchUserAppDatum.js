"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
var tmc_1 = tslib_1.__importDefault(require("../services/tmc"))
var luxon_1 = require("luxon")
var prisma_1 = tslib_1.__importDefault(require("./lib/prisma"))
var logger_1 = tslib_1.__importDefault(require("./lib/logger"))
var CONFIG_NAME = "userAppDatum"
var prisma = prisma_1["default"]()
var course
var old
var logger = logger_1["default"]({ service: "fetch-user-app-datum" })
var fetchUserAppDatum = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var startTime,
      tmc,
      existingConfigs,
      latestTimeStamp,
      data_from_tmc,
      data,
      saveInterval,
      saveCounter,
      i,
      p,
      existingUsers,
      error_1,
      existingCourses,
      existingUserCourseSettings,
      stopTime
    var _a
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          startTime = new Date().getTime()
          tmc = new tmc_1["default"]()
          return [
            4 /*yield*/,
            prisma.userAppDatumConfig.findMany({
              where: { name: CONFIG_NAME },
            }),
          ]
        case 1:
          existingConfigs = _b.sent()
          latestTimeStamp =
            existingConfigs.length > 0
              ? existingConfigs[0].timestamp // ((await prisma.userAppDatumConfig.findOne({ name: CONFIG_NAME })) ?? {}).timestamp
              : null
          logger.info(latestTimeStamp)
          return [
            4 /*yield*/,
            tmc.getUserAppDatum(
              (_a =
                latestTimeStamp === null || latestTimeStamp === void 0
                  ? void 0
                  : latestTimeStamp.toISOString()) !== null && _a !== void 0
                ? _a
                : null,
            ),
          ]
        case 2:
          data_from_tmc = _b.sent()
          logger.info("Got data from tmc")
          logger.info("data length", data_from_tmc.length)
          logger.info("sorting")
          data = data_from_tmc.sort(function (a, b) {
            return (
              luxon_1.DateTime.fromISO(a.updated_at).toMillis() -
              luxon_1.DateTime.fromISO(b.updated_at).toMillis()
            )
          })
          logger.info(data)
          logger.info("sorted")
          saveInterval = 10000
          saveCounter = 0
          i = 0
          _b.label = 3
        case 3:
          if (!(i < data.length)) return [3 /*break*/, 20]
          saveCounter++
          p = data[i]
          if (p.user_id == null) return [3 /*break*/, 19]
          if (i % 1000 == 0) logger.info(i)
          if (!p || p == "undefined" || p == null) {
            logger.warning(
              "not p:",
              p,
              "i is",
              i,
              "while data.length is",
              data.length,
            )
            return [3 /*break*/, 19]
          }
          return [
            4 /*yield*/,
            prisma.user.findMany({
              where: { upstream_id: p.user_id },
            }),
          ]
        case 4:
          existingUsers = _b.sent()
          if (!(existingUsers.length < 1)) return [3 /*break*/, 10]
          _b.label = 5
        case 5:
          _b.trys.push([5, 7, , 10])
          return [4 /*yield*/, getUserFromTmcAndSaveToDB(p.user_id, tmc)]
        case 6:
          _b.sent()
          return [3 /*break*/, 10]
        case 7:
          error_1 = _b.sent()
          logger.error(
            "error in getting user data from tmc, trying again in 30s...",
          )
          logger.error("above error is:", error_1)
          return [4 /*yield*/, delay(30 * 1000)]
        case 8:
          _b.sent()
          return [4 /*yield*/, getUserFromTmcAndSaveToDB(p.user_id, tmc)]
        case 9:
          _b.sent()
          return [3 /*break*/, 10]
        case 10:
          return [
            4 /*yield*/,
            prisma.course.findMany({
              where: { slug: p.namespace },
            }),
          ]
        case 11:
          existingCourses = _b.sent()
          if (!(existingCourses.length < 1)) return [3 /*break*/, 13]
          return [
            4 /*yield*/,
            prisma.course.create({
              data: {
                slug: p.namespace,
                name: p.namespace,
                hidden: true,
                teacher_in_charge_name: "",
                teacher_in_charge_email: "",
                start_date: "",
              },
            }),
          ]
        case 12:
          _b.sent()
          _b.label = 13
        case 13:
          return [
            4 /*yield*/,
            prisma.course.findOne({ where: { slug: p.namespace } }),
          ]
        case 14:
          course = _b.sent()
          if (!course) {
            process.exit(1)
          }
          return [
            4 /*yield*/,
            prisma.userCourseSetting.findMany({
              where: {
                user: { upstream_id: p.user_id },
                course_id: course.id,
              },
            }),
          ]
        case 15:
          existingUserCourseSettings = _b.sent()
          if (!(existingUserCourseSettings.length < 1)) return [3 /*break*/, 17]
          return [
            4 /*yield*/,
            prisma.userCourseSetting.create({
              data: {
                user: {
                  connect: { upstream_id: p.user_id },
                },
                course: { connect: { id: course.id } },
              },
            }),
          ]
        case 16:
          old = _b.sent()
          return [3 /*break*/, 18]
        case 17:
          old = existingUserCourseSettings[0]
          _b.label = 18
        case 18:
          switch (p.field_name) {
            case "language":
              saveLanguage(p)
              break
            case "country":
              saveCountry(p)
              break
            case "research":
              saveResearch(p)
              break
            case "marketing":
              saveMarketing(p)
              break
            case "course_variant": //course_variant and deadline are functionally the same (deadline is used in elements-of-ai)
            case "deadline": // deadline does not tell when the deadline is but what is the course variant
              saveCourseVariant(p)
              break
            default:
              saveOther(p)
          }
          if (saveCounter % saveInterval == 0)
            saveProgress(prisma, new Date(p.updated_at))
          _b.label = 19
        case 19:
          i++
          return [3 /*break*/, 3]
        case 20:
          return [
            4 /*yield*/,
            saveProgress(prisma, new Date(data[data.length - 1].updated_at)),
          ]
        case 21:
          _b.sent()
          stopTime = new Date().getTime()
          logger.info("used", stopTime - startTime, "milliseconds")
          return [2 /*return*/]
      }
    })
  })
}
var saveLanguage = function (p) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.userCourseSetting.update({
              where: {
                id: old.id,
              },
              data: {
                language: p.value,
              },
            }),
          ]
        case 1:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
var saveCountry = function (p) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.userCourseSetting.update({
              where: {
                id: old.id,
              },
              data: {
                country: p.value,
              },
            }),
          ]
        case 1:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
var saveResearch = function (p) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var value
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          value = p.value == "t" ? true : false
          return [
            4 /*yield*/,
            prisma.userCourseSetting.update({
              where: {
                id: old.id,
              },
              data: {
                research: value,
              },
            }),
          ]
        case 1:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
var saveMarketing = function (p) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var value
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          value = p.value == "t" ? true : false
          return [
            4 /*yield*/,
            prisma.userCourseSetting.update({
              where: {
                id: old.id,
              },
              data: {
                marketing: value,
              },
            }),
          ]
        case 1:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
var saveCourseVariant = function (p) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.userCourseSetting.update({
              where: {
                id: old.id,
              },
              data: {
                course_variant: p.value,
              },
            }),
          ]
        case 1:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
var saveOther = function (p) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var other
    var _a
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          other = (_a = old.other) !== null && _a !== void 0 ? _a : {}
          if (p.value == "t") {
            p.value = true
          } else if (p.value == "f") {
            p.value = false
          }
          other[p.field_name] = p.value
          return [
            4 /*yield*/,
            prisma.userCourseSetting.update({
              where: {
                id: old.id,
              },
              data: {
                other: other,
              },
            }),
          ]
        case 1:
          _b.sent()
          return [2 /*return*/]
      }
    })
  })
}
var getUserFromTmcAndSaveToDB = function (user_id, tmc) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var details, prismaDetails, result, e_1
    var _a, _b
    return tslib_1.__generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [4 /*yield*/, tmc.getUserDetailsById(user_id)]
        case 1:
          details = _c.sent()
          prismaDetails = {
            upstream_id: details.id,
            administrator: details.administrator,
            email: details.email.trim(),
            first_name: details.user_field.first_name.trim(),
            last_name: details.user_field.last_name.trim(),
            username: details.username,
          }
          _c.label = 2
        case 2:
          _c.trys.push([2, 4, , 7])
          return [
            4 /*yield*/,
            prisma.user.upsert({
              where: { upstream_id: details.id },
              create: prismaDetails,
              update: prismaDetails,
            }),
          ]
        case 3:
          result = _c.sent()
          return [2 /*return*/, result]
        case 4:
          e_1 = _c.sent()
          logger.error(
            "Failed to upsert user with upstream id " +
              details.id +
              ". Values we tried to upsert: " +
              JSON.stringify(prismaDetails) +
              ". Values found from the database: " +
              JSON.stringify(details),
          )
          if (
            !((_b =
              (_a = e_1.meta) === null || _a === void 0
                ? void 0
                : _a.target) === null || _b === void 0
              ? void 0
              : _b.includes("username"))
          )
            return [3 /*break*/, 6]
          logger.info("Removing user with duplicate username")
          return [
            4 /*yield*/,
            prisma.user["delete"]({ where: { username: details.username } }),
          ]
        case 5:
          _c.sent()
          _c.label = 6
        case 6:
          throw e_1
        case 7:
          return [2 /*return*/]
      }
    })
  })
}
// FIXME: not used anywhere
/* const currentDate = () => {
  var today = new Date()
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  var dateTime = date + " " + time
  return encodeURIComponent(dateTime)
} */
var delay = function (ms) {
  return new Promise(function (res) {
    return setTimeout(res, ms)
  })
}
function saveProgress(prisma, dateToDB) {
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          logger.info("saving")
          dateToDB.setMinutes(dateToDB.getMinutes() - 10)
          return [
            4 /*yield*/,
            prisma.userAppDatumConfig.upsert({
              where: { name: CONFIG_NAME },
              create: {
                name: CONFIG_NAME,
                timestamp: dateToDB,
              },
              update: {
                timestamp: dateToDB,
              },
            }),
          ]
        case 1:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
fetchUserAppDatum()
  .then(function () {
    return process.exit(0)
  })
  ["catch"](function (e) {
    return logger.error(e)
  })
//# sourceMappingURL=fetchUserAppDatum.js.map
