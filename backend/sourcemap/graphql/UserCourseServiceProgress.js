"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var accessControl_1 = require("../accessControl")
nexus_1.schema.objectType({
  name: "UserCourseServiceProgress",
  definition: function (t) {
    var _this = this
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    // t.model.progress()
    t.model.service_id()
    t.model.service()
    t.model.timestamp()
    t.model.user_id()
    t.model.user()
    t.model.user_course_progress_id()
    t.model.user_course_progress()
    t.model.course_id()
    t.model.course()
    t.list.field("progress", {
      type: "Json",
      resolve: function (parent, _args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var res
          var _a
          return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                return [
                  4 /*yield*/,
                  ctx.db.userCourseServiceProgress.findOne({
                    where: { id: parent.id },
                    select: { progress: true },
                  }),
                ]
              case 1:
                res = _b.sent()
                return [
                  2 /*return*/,
                  (_a =
                    res === null || res === void 0 ? void 0 : res.progress) !==
                    null && _a !== void 0
                    ? _a
                    : [],
                ] // errors without any typing - JSON value thing
            }
          })
        })
      },
    })
  },
})
/*********************** QUERIES **********************/
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    var _this = this
    t.field("userCourseServiceProgress", {
      type: "UserCourseServiceProgress",
      args: {
        user_id: nexus_1.schema.idArg(),
        course_id: nexus_1.schema.idArg(),
        service_id: nexus_1.schema.idArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var user_id, course_id, service_id, result
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(user_id = args.user_id),
                  (course_id = args.course_id),
                  (service_id = args.service_id)
                return [
                  4 /*yield*/,
                  ctx.db.userCourseServiceProgress.findMany({
                    where: {
                      user_id: user_id,
                      course_id: course_id,
                      service_id: service_id,
                    },
                  }),
                ]
              case 1:
                result = _a.sent()
                return [2 /*return*/, result[0]]
            }
          })
        })
      },
    })
    t.crud.userCourseServiceProgresses({
      filtering: {
        user_id: true,
        course_id: true,
        service_id: true,
      },
      pagination: true,
      authorize: accessControl_1.isAdmin,
    })
    /*t.list.field("UserCourseServiceProgresses", {
          type: "user_course_service_progress",
          args: {
            user_id: schema.idArg(),
            course_id: schema.idArg(),
            service_id: schema.idArg(),
            first: schema.intArg(),
            after: schema.idArg(),
            last: schema.intArg(),
            before: schema.idArg(),
          },
          resolve: (_, args, ctx) => {
            checkAccess(ctx)
            const {
              user_id,
              course_id,
              service_id,
              first,
              last,
              before,
              after,
            } = args
            return ctx.db.user_course_service_progress.findMany({
              where: {
                user: user_id,
                course: course_id,
                service: service_id,
              },
              first,
              last,
              before: { id: before },
              after: { id: after },
            })
          },
        })*/
  },
})
/********************** MUTATIONS *********************/
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addUserCourseServiceProgress", {
      type: "UserCourseServiceProgress",
      args: {
        progress: nexus_1.schema.arg({ type: "PointsByGroup", required: true }),
        service_id: nexus_1.schema.idArg({ required: true }),
        user_course_progress_id: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var service_id, progress, user_course_progress_id, course, user
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(service_id = args.service_id),
                  (progress = args.progress),
                  (user_course_progress_id = args.user_course_progress_id)
                return [
                  4 /*yield*/,
                  ctx.db.userCourseProgress
                    .findOne({ where: { id: user_course_progress_id } })
                    .course(),
                ]
              case 1:
                course = _a.sent()
                return [
                  4 /*yield*/,
                  ctx.db.userCourseProgress
                    .findOne({ where: { id: user_course_progress_id } })
                    .user(),
                ]
              case 2:
                user = _a.sent()
                if (!course || !user) {
                  throw new Error("course or user not found")
                }
                return [
                  2 /*return*/,
                  ctx.db.userCourseServiceProgress.create({
                    data: {
                      course: {
                        connect: { id: course.id },
                      },
                      progress: progress,
                      service: {
                        connect: { id: service_id },
                      },
                      user: {
                        connect: { id: user.id },
                      },
                      user_course_progress: {
                        connect: { id: user_course_progress_id },
                      },
                    },
                  }),
                ]
            }
          })
        })
      },
    })
  },
})
//# sourceMappingURL=UserCourseServiceProgress.js.map
