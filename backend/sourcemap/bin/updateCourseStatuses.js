"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var kafkaProducer_1 = tslib_1.__importDefault(
  require("../services/kafkaProducer"),
)
var luxon_1 = require("luxon")
var prisma_1 = tslib_1.__importDefault(require("./lib/prisma"))
var prisma = prisma_1["default"]()
var updateCourseStatuses = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var courses, kafkaProducer
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, prisma.course.findMany({})]
        case 1:
          courses = _a.sent()
          kafkaProducer = new kafkaProducer_1["default"]()
          Promise.all(
            courses.map(function (course) {
              return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var status,
                  newStatus,
                  courseStartDate,
                  courseEndDate,
                  currentDate,
                  updatedCourse,
                  msg
                return tslib_1.__generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      status = course.status
                      newStatus = status
                      courseStartDate = course.start_date
                        ? luxon_1.DateTime.fromISO(course.start_date)
                        : null
                      courseEndDate = course.end_date
                        ? luxon_1.DateTime.fromISO(course.end_date)
                        : null
                      currentDate = luxon_1.DateTime.local()
                      if (
                        newStatus === "Upcoming" &&
                        courseStartDate &&
                        currentDate >= courseStartDate
                      ) {
                        newStatus = "Active"
                      }
                      if (
                        newStatus === "Active" &&
                        courseEndDate &&
                        currentDate > courseEndDate
                      ) {
                        newStatus = "Ended"
                      }
                      if (status === newStatus) {
                        return [2 /*return*/, Promise.resolve()]
                      }
                      return [
                        4 /*yield*/,
                        prisma.course.update({
                          where: {
                            id: course.id,
                          },
                          data: {
                            status: newStatus,
                          },
                        }),
                      ]
                    case 1:
                      updatedCourse = _a.sent()
                      console.log(
                        "Updated course " +
                          course.name +
                          " from " +
                          status +
                          " to " +
                          newStatus,
                      )
                      msg = {
                        message: JSON.stringify(updatedCourse),
                        partition: null,
                        topic: "updated-course-status",
                      }
                      return [
                        4 /*yield*/,
                        kafkaProducer.queueProducerMessage(msg),
                      ]
                    case 2:
                      _a.sent()
                      return [2 /*return*/]
                  }
                })
              })
            }),
          )
          return [4 /*yield*/, kafkaProducer.disconnect()]
        case 2:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
updateCourseStatuses()
//# sourceMappingURL=updateCourseStatuses.js.map
