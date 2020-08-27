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
var CONFIG_NAME = "userFieldValues"
var prisma = prisma_1["default"]()
var logger = logger_1["default"]({ service: "fetch-user-field-values" })
var fetcUserFieldValues = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var startTime,
      tmc,
      existingConfig,
      latestTimeStamp,
      data_from_tmc,
      data,
      saveInterval,
      saveCounter,
      i,
      p,
      existingUsers,
      error_1,
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
          existingConfig = _b.sent()
          latestTimeStamp =
            existingConfig.length > 0
              ? existingConfig[0].timestamp // ((await prisma.userAppDatumConfig({ name: CONFIG_NAME })) ?? {}).timestamp
              : null
          logger.info(latestTimeStamp)
          return [
            4 /*yield*/,
            tmc.getUserFieldValues(
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
          if (!(i < data.length)) return [3 /*break*/, 14]
          saveCounter++
          p = data[i]
          if (p.user_id == null) return [3 /*break*/, 13]
          if (i % 1000 == 0) logger.info(i)
          if (!p || p == null) {
            logger.warning(
              "not p:",
              p,
              "i is",
              i,
              "while data.length is",
              data.length,
            )
            return [3 /*break*/, 13]
          }
          return [
            4 /*yield*/,
            prisma.user.findMany({
              where: {
                upstream_id: p.user_id,
              },
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
          if (
            !(
              p.field_name === "organizational_id" &&
              p.value &&
              p.value.trim() != ""
            )
          )
            return [3 /*break*/, 12]
          return [
            4 /*yield*/,
            prisma.user.update({
              where: { upstream_id: p.user_id },
              data: {
                student_number: p.value.trim(),
              },
            }),
          ]
        case 11:
          _b.sent()
          _b.label = 12
        case 12:
          if (saveCounter % saveInterval == 0) {
            saveProgress(prisma, new Date(p.updated_at))
          }
          _b.label = 13
        case 13:
          i++
          return [3 /*break*/, 3]
        case 14:
          return [
            4 /*yield*/,
            saveProgress(prisma, new Date(data[data.length - 1].updated_at)),
          ]
        case 15:
          _b.sent()
          stopTime = new Date().getTime()
          logger.info("used", stopTime - startTime, "milliseconds")
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
fetcUserFieldValues()
  .then(function () {
    return process.exit(0)
  })
  ["catch"](function (e) {
    return logger.error(e)
  })
//# sourceMappingURL=fetchUserFieldValues.js.map
