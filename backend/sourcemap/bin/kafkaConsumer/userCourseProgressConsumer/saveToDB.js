"use strict"
exports.__esModule = true
exports.saveToDatabase = void 0
var tslib_1 = require("tslib")
var luxon_1 = require("luxon")
var generateUserCourseProgress_1 = require("./generateUserCourseProgress")
var wsServer_1 = require("../../../wsServer")
var getUserFromTMC_1 = tslib_1.__importDefault(
  require("../common/getUserFromTMC"),
)
var knex_1 = tslib_1.__importDefault(require("knex"))
var Knex = knex_1["default"]({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  searchPath:
    process.env.NODE_ENV === "production"
      ? ["moocfi$production"]
      : ["default$default"],
})
exports.saveToDatabase = function (message, prisma, logger) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var timestamp,
      user,
      e_1,
      course,
      userCourseProgress,
      userCourseServiceProgress,
      oldTimestamp
    var _a, _b
    return tslib_1.__generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          timestamp = luxon_1.DateTime.fromISO(message.timestamp)
          return [
            4 /*yield*/,
            Knex("user").where("upstream_id", message.user_id).limit(1),
          ]
        case 1:
          user = _c.sent()[0]
          if (!!user) return [3 /*break*/, 6]
          _c.label = 2
        case 2:
          _c.trys.push([2, 4, , 6])
          return [
            4 /*yield*/,
            getUserFromTMC_1["default"](prisma, message.user_id),
          ]
        case 3:
          user = _c.sent()
          return [3 /*break*/, 6]
        case 4:
          e_1 = _c.sent()
          return [
            4 /*yield*/,
            Knex("user").where("upstream_id", message.user_id).limit(1),
          ]
        case 5:
          user = _c.sent()[0]
          if (!user) {
            throw e_1
          }
          console.log("Mitigated race condition with user imports")
          return [3 /*break*/, 6]
        case 6:
          return [
            4 /*yield*/,
            prisma.course.findOne({
              where: { id: message.course_id },
            }),
          ]
        case 7:
          course = _c.sent()
          if (!user || !course) {
            logger.error("Invalid user or course")
            return [2 /*return*/, -1]
          }
          return [
            4 /*yield*/,
            Knex("user_course_progress")
              .where(
                "user_id",
                user === null || user === void 0 ? void 0 : user.id,
              )
              .where("course_id", message.course_id)
              .limit(1),
          ]
        case 8:
          userCourseProgress = _c.sent()[0]
          if (!!userCourseProgress) return [3 /*break*/, 10]
          return [
            4 /*yield*/,
            prisma.userCourseProgress.create({
              data: {
                course: {
                  connect: { id: message.course_id },
                },
                user: {
                  connect: {
                    id: user === null || user === void 0 ? void 0 : user.id,
                  },
                },
                progress: message.progress,
              },
            }),
          ]
        case 9:
          userCourseProgress = _c.sent()
          _c.label = 10
        case 10:
          return [
            4 /*yield*/,
            Knex("user_course_service_progress")
              .where(
                "user_id",
                user === null || user === void 0 ? void 0 : user.id,
              )
              .where("course_id", message.course_id)
              .where("service_id", message.service_id)
              .limit(1),
          ]
        case 11:
          userCourseServiceProgress = _c.sent()[0]
          if (!userCourseServiceProgress) return [3 /*break*/, 13]
          oldTimestamp = luxon_1.DateTime.fromISO(
            (_b =
              (_a =
                userCourseServiceProgress === null ||
                userCourseServiceProgress === void 0
                  ? void 0
                  : userCourseServiceProgress.timestamp) === null ||
              _a === void 0
                ? void 0
                : _a.toISOString()) !== null && _b !== void 0
              ? _b
              : "",
          )
          if (timestamp < oldTimestamp) {
            logger.error("Timestamp older than in DB, aborting")
            return [2 /*return*/, false]
          }
          return [
            4 /*yield*/,
            prisma.userCourseServiceProgress.update({
              where: {
                id: userCourseServiceProgress.id,
              },
              data: {
                progress: message.progress,
                timestamp: timestamp.toJSDate(),
              },
            }),
          ]
        case 12:
          _c.sent()
          return [3 /*break*/, 15]
        case 13:
          return [
            4 /*yield*/,
            prisma.userCourseServiceProgress.create({
              data: {
                user: {
                  connect: {
                    id: user === null || user === void 0 ? void 0 : user.id,
                  },
                },
                course: {
                  connect: { id: message.course_id },
                },
                service: {
                  connect: { id: message.service_id },
                },
                progress: message.progress,
                user_course_progress: {
                  connect: { id: userCourseProgress.id },
                },
                timestamp: timestamp.toJSDate(),
              },
            }),
          ]
        case 14:
          _c.sent()
          _c.label = 15
        case 15:
          return [
            4 /*yield*/,
            generateUserCourseProgress_1.generateUserCourseProgress({
              user: user,
              course: course,
              userCourseProgress: userCourseProgress,
            }),
          ]
        case 16:
          _c.sent()
          wsServer_1.pushMessageToClient(
            message.user_id,
            message.course_id,
            wsServer_1.MessageType.PROGRESS_UPDATED,
          )
          logger.info("Saved to DB succesfully")
          return [2 /*return*/, true]
      }
    })
  })
}
//# sourceMappingURL=saveToDB.js.map
