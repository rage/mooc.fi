"use strict"
exports.__esModule = true
exports.saveToDatabase = void 0
var tslib_1 = require("tslib")
var luxon_1 = require("luxon")
exports.saveToDatabase = function (message, prisma, logger) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var existingCourse
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.course.findOne({
              where: { id: message.course_id },
            }),
          ]
        case 1:
          existingCourse = _a.sent()
          if (!existingCourse) {
            logger.error("given course does not exist")
            return [2 /*return*/, false]
          }
          message.data.forEach(function (exercise) {
            handleExercise(
              exercise,
              message.course_id,
              luxon_1.DateTime.fromISO(message.timestamp),
              message.service_id,
              logger,
              prisma,
            )
          })
          return [
            4 /*yield*/,
            prisma.exercise.updateMany({
              where: {
                AND: {
                  course_id: message.course_id,
                  service_id: message.service_id,
                  custom_id: {
                    not: {
                      in: message.data.map(function (p) {
                        return p.id
                      }),
                    },
                  },
                },
              },
              data: {
                deleted: true,
              },
            }),
          ]
        case 2:
          _a.sent()
          logger.info("Saved to DB succesfully")
          return [2 /*return*/, true]
      }
    })
  })
}
var handleExercise = function (
  exercise,
  course_id,
  timestamp,
  service_id,
  logger,
  prisma,
) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var existingExercises, oldExercises, oldExercise
    var _a, _b
    return tslib_1.__generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.exercise.findMany({
              where: {
                course_id: course_id,
                service_id: service_id,
                custom_id: exercise.id,
              },
            }),
          ]
        case 1:
          existingExercises = _c.sent()
          if (!(existingExercises.length > 0)) return [3 /*break*/, 4]
          return [
            4 /*yield*/,
            prisma.exercise.findMany({
              where: {
                course_id: course_id,
                service_id: service_id,
                custom_id: exercise.id,
              },
            }),
          ]
        case 2:
          oldExercises = _c.sent()
          oldExercise = oldExercises[0]
          // FIXME: well this is weird
          if (
            luxon_1.DateTime.fromISO(
              (_b =
                (_a = oldExercise.timestamp) === null || _a === void 0
                  ? void 0
                  : _a.toISOString()) !== null && _b !== void 0
                ? _b
                : "",
            ) > timestamp
          ) {
            logger.warn(
              "Timestamp is older than on existing exercise on " +
                JSON.stringify(exercise) +
                "skipping this exercise",
            )
            return [2 /*return*/]
          }
          return [
            4 /*yield*/,
            prisma.exercise.update({
              where: { id: oldExercise.id },
              data: {
                name: exercise.name,
                custom_id: exercise.id,
                part: Number(exercise.part),
                section: Number(exercise.section),
                max_points: Number(exercise.max_points),
                timestamp: timestamp.toJSDate(),
                deleted: false,
              },
            }),
          ]
        case 3:
          _c.sent()
          return [3 /*break*/, 6]
        case 4:
          return [
            4 /*yield*/,
            prisma.exercise.create({
              data: {
                name: exercise.name,
                custom_id: exercise.id,
                part: Number(exercise.part),
                section: Number(exercise.section),
                max_points: Number(exercise.max_points),
                course: { connect: { id: course_id } },
                service: { connect: { id: service_id } },
                timestamp: timestamp.toJSDate(),
              },
            }),
          ]
        case 5:
          _c.sent()
          _c.label = 6
        case 6:
          return [2 /*return*/]
      }
    })
  })
}
//# sourceMappingURL=saveToDB.js.map
