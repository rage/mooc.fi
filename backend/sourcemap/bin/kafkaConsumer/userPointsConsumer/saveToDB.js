"use strict"
exports.__esModule = true
exports.saveToDatabase = void 0
var tslib_1 = require("tslib")
var luxon_1 = require("luxon")
var generateUserCourseProgress_1 = require("../userCourseProgressConsumer/generateUserCourseProgress")
var knex_1 = tslib_1.__importDefault(require("knex"))
var getUserFromTMC_1 = tslib_1.__importDefault(
  require("../common/getUserFromTMC"),
)
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
    // TODO: should this use the env search path?
    process.env.NODE_ENV === "production"
      ? ["moocfi$production"]
      : ["default$default"],
})
// @ts-ignore: not used
var isUserInDB = function (user_id) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, Knex("user").where("upstream_id", "=", user_id)]
        case 1:
          return [2 /*return*/, _a.sent()]
      }
    })
  })
}
exports.saveToDatabase = function (message, prisma, logger) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var timestamp,
      user,
      e_1,
      course,
      existingExercises,
      exercises,
      exercise,
      exerciseCompleteds,
      exerciseCompleted,
      savedExerciseCompletion,
      oldTimestamp
    var _a, _b
    return tslib_1.__generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          logger.info("Parsing timestamp")
          timestamp = luxon_1.DateTime.fromISO(message.timestamp)
          logger.info("Checking if user " + message.user_id + " exists.")
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
            return [2 /*return*/, false]
          }
          logger.info(
            "Checking if a exercise exists with id " + message.exercise_id,
          )
          return [
            4 /*yield*/,
            prisma.exercise.findMany({
              where: { custom_id: message.exercise_id },
            }),
          ]
        case 8:
          existingExercises = _c.sent()
          if (existingExercises.length < 1) {
            logger.error(
              "Given exercise does not exist: id " + message.exercise_id,
            )
            return [2 /*return*/, false]
          }
          logger.info("Getting the exercise")
          return [
            4 /*yield*/,
            prisma.exercise.findMany({
              take: 1,
              where: {
                custom_id: message.exercise_id,
              },
            }),
          ]
        case 9:
          exercises = _c.sent()
          exercise = exercises[0]
          logger.info("Getting the completion")
          return [
            4 /*yield*/,
            prisma.exerciseCompletion.findMany({
              take: 1,
              where: {
                exercise: {
                  custom_id: message.exercise_id,
                },
                user: { upstream_id: Number(message.user_id) },
              },
              orderBy: { timestamp: "desc" },
            }),
          ]
        case 10:
          exerciseCompleteds = _c.sent()
          exerciseCompleted = exerciseCompleteds[0]
          if (!!exerciseCompleted) return [3 /*break*/, 12]
          logger.info("No previous completion, creating a new one")
          return [
            4 /*yield*/,
            prisma.exerciseCompletion.create({
              data: {
                exercise: {
                  connect: { id: exercise.id },
                },
                user: {
                  connect: { upstream_id: Number(message.user_id) },
                },
                n_points: message.n_points,
                completed: message.completed,
                exercise_completion_required_actions: {
                  create: message.required_actions.map(function (ra) {
                    return {
                      value: ra,
                    }
                  }),
                },
                timestamp: message.timestamp,
              },
            }),
          ]
        case 11:
          savedExerciseCompletion = _c.sent()
          return [3 /*break*/, 14]
        case 12:
          logger.info("Updating previous completion")
          oldTimestamp = luxon_1.DateTime.fromISO(
            (_b =
              (_a =
                exerciseCompleted === null || exerciseCompleted === void 0
                  ? void 0
                  : exerciseCompleted.timestamp) === null || _a === void 0
                ? void 0
                : _a.toISOString()) !== null && _b !== void 0
              ? _b
              : "",
          )
          if (timestamp <= oldTimestamp) {
            logger.error("Timestamp older than in DB, aborting")
            return [2 /*return*/, false]
          }
          return [
            4 /*yield*/,
            prisma.exerciseCompletion.update({
              where: { id: exerciseCompleted.id },
              data: {
                n_points: Number(message.n_points),
                completed: message.completed,
                exercise_completion_required_actions: {
                  create: message.required_actions.map(function (ra) {
                    return {
                      value: ra,
                    }
                  }),
                },
                timestamp: message.timestamp,
              },
            }),
          ]
        case 13:
          savedExerciseCompletion = _c.sent()
          _c.label = 14
        case 14:
          return [
            4 /*yield*/,
            generateUserCourseProgress_1.CheckCompletion(user, course),
          ]
        case 15:
          _c.sent()
          logger.info("Saved to DB succesfully")
          return [2 /*return*/, true]
      }
    })
  })
}
//# sourceMappingURL=saveToDB.js.map
