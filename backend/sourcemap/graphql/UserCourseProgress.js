"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var apollo_server_core_1 = require("apollo-server-core")
var accessControl_1 = require("../accessControl")
nexus_1.schema.objectType({
  name: "UserCourseProgress",
  definition: function (t) {
    var _this = this
    t.model.id()
    t.model.course_id()
    t.model.course()
    t.model.created_at()
    t.model.max_points()
    t.model.n_points()
    // TODO/FIXME: this was borked on some previous version because of JSON, might work now
    // t.model.progress()
    t.model.updated_at()
    t.model.user_id()
    t.model.user()
    t.model.user_course_service_progresses()
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
                  ctx.db.userCourseProgress.findOne({
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
                ] // type error without any
            }
          })
        })
      },
    })
    // t.prismaFields(["*"])
    t.field("user_course_settings", {
      type: "UserCourseSetting",
      nullable: true,
      resolve: function (parent, _, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var _a, course_id, user_id, userCourseSettings
          var _b
          return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                return [
                  4 /*yield*/,
                  ctx.db.userCourseProgress.findOne({
                    where: { id: parent.id },
                    select: {
                      course_id: true,
                      user_id: true,
                    },
                  }),
                ]
              case 1:
                ;(_a = _c.sent() || {}),
                  (course_id = _a.course_id),
                  (user_id = _a.user_id)
                /*const course= await ctx.db
                              .user_course_progress.findOne({ where: { id: parent.id } })
                              .course_courseTouser_course_progress()
                            const user: User = await ctx.db
                              .user_course_progress.findOne({ where: { id: parent.id } })
                              .user_course_service_progress()*/
                if (!course_id || !user_id) {
                  throw new Error("course or user not found")
                }
                return [
                  4 /*yield*/,
                  ctx.db.userCourseSetting.findMany({
                    where: {
                      course_id: course_id,
                      user_id: user_id,
                    },
                  }),
                  // FIXME: what if there's not any?
                ]
              case 2:
                userCourseSettings = _c.sent()
                // FIXME: what if there's not any?
                return [
                  2 /*return*/,
                  (_b =
                    userCourseSettings === null || userCourseSettings === void 0
                      ? void 0
                      : userCourseSettings[0]) !== null && _b !== void 0
                    ? _b
                    : null,
                ]
            }
          })
        })
      },
    })
    t.field("exercise_progress", {
      type: "ExerciseProgress",
      resolve: function (parent, _, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var _a,
            course_id,
            user_id,
            courseProgresses,
            courseProgress,
            exercises,
            completedExercises,
            totalProgress,
            exerciseProgress
          var _b, _c
          return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
              case 0:
                return [
                  4 /*yield*/,
                  ctx.db.userCourseProgress.findOne({
                    where: { id: parent.id },
                    select: {
                      course_id: true,
                      user_id: true,
                    },
                  }),
                ]
              case 1:
                ;(_a = _d.sent() || {}),
                  (course_id = _a.course_id),
                  (user_id = _a.user_id)
                /*const course: Course = await ctx.db
                              .user_course_progress.findOne({ where: { id: parent.id } })
                              .course_courseTouser_course_progress()
                            const user: User = await ctx.db
                              .user_course_progress.findOne({ where: { id: parent.id } })
                              .user_course_service_progress()*/
                if (!course_id || !user_id) {
                  throw new Error("no course or user found")
                }
                return [
                  4 /*yield*/,
                  ctx.db.userCourseProgress.findMany({
                    where: { course_id: course_id, user_id: user_id },
                  }),
                  // TODO/FIXME: proper typing
                ]
              case 2:
                courseProgresses = _d.sent()
                courseProgress =
                  (_b =
                    courseProgresses === null || courseProgresses === void 0
                      ? void 0
                      : courseProgresses[0].progress) !== null && _b !== void 0
                    ? _b
                    : []
                return [
                  4 /*yield*/,
                  ctx.db.course
                    .findOne({ where: { id: course_id } })
                    .exercises(),
                ]
              case 3:
                exercises = _d.sent()
                return [
                  4 /*yield*/,
                  ctx.db.exerciseCompletion.findMany({
                    where: {
                      exercise: { course_id: course_id },
                      user_id: user_id,
                    },
                  }),
                ]
              case 4:
                completedExercises = _d.sent()
                totalProgress =
                  ((_c =
                    courseProgress === null || courseProgress === void 0
                      ? void 0
                      : courseProgress.reduce(function (acc, curr) {
                          return acc + curr.progress
                        }, 0)) !== null && _c !== void 0
                    ? _c
                    : 0) / (courseProgress.length || 1)
                exerciseProgress =
                  completedExercises.length / (exercises.length || 1)
                return [
                  2 /*return*/,
                  {
                    total: totalProgress,
                    exercises: exerciseProgress,
                  },
                ]
            }
          })
        })
      },
    })
  },
})
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    var _this = this
    t.field("userCourseProgress", {
      type: "UserCourseProgress",
      args: {
        user_id: nexus_1.schema.idArg({ required: true }),
        course_id: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var user_id, course_id, result
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(user_id = args.user_id), (course_id = args.course_id)
                return [
                  4 /*yield*/,
                  ctx.db.userCourseProgress.findMany({
                    where: {
                      user_id: user_id,
                      course_id: course_id,
                    },
                  }),
                ]
              case 1:
                result = _a.sent()
                if (!result.length)
                  throw new apollo_server_core_1.UserInputError("Not found")
                return [2 /*return*/, result[0]]
            }
          })
        })
      },
    })
    // FIXME: (?) broken until the nexus json thing is fixed or smth
    /*t.crud.userCourseProgresses({
          filtering: {
            user: true,
            course_courseTouser_course_progress: true,
          },
          pagination: true,
        })*/
    t.list.field("userCourseProgresses", {
      type: "UserCourseProgress",
      args: {
        user_id: nexus_1.schema.idArg(),
        course_slug: nexus_1.schema.stringArg(),
        course_id: nexus_1.schema.idArg(),
        skip: nexus_1.schema.intArg(),
        take: nexus_1.schema.intArg(),
        cursor: nexus_1.schema.arg({
          type: "UserCourseProgressWhereUniqueInput",
        }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        var _a
        var skip = args.skip,
          take = args.take,
          cursor = args.cursor,
          user_id = args.user_id,
          course_id = args.course_id,
          course_slug = args.course_slug
        return ctx.db.userCourseProgress.findMany({
          skip: skip !== null && skip !== void 0 ? skip : undefined,
          take: take !== null && take !== void 0 ? take : undefined,
          cursor: cursor
            ? {
                id: (_a = cursor.id) !== null && _a !== void 0 ? _a : undefined,
              }
            : undefined,
          /*first: first ?? undefined,
                    last: last ?? undefined,
                    before: before ? { id: before } : undefined,
                    after: after ? { id: after } : undefined,*/
          where: {
            user_id: user_id,
            course: {
              OR: [
                {
                  id:
                    course_id !== null && course_id !== void 0
                      ? course_id
                      : undefined,
                },
                {
                  slug:
                    course_slug !== null && course_slug !== void 0
                      ? course_slug
                      : undefined,
                },
              ],
            },
          },
        })
      },
    })
  },
})
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    t.field("addUserCourseProgress", {
      type: "UserCourseProgress",
      args: {
        user_id: nexus_1.schema.idArg({ required: true }),
        course_id: nexus_1.schema.idArg({ required: true }),
        progress: nexus_1.schema.arg({
          type: "PointsByGroup",
          list: true,
          required: true,
        }),
        max_points: nexus_1.schema.floatArg(),
        n_points: nexus_1.schema.floatArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        var user_id = args.user_id,
          course_id = args.course_id,
          progress = args.progress,
          max_points = args.max_points,
          n_points = args.n_points
        return ctx.db.userCourseProgress.create({
          data: {
            user: { connect: { id: user_id } },
            course: { connect: { id: course_id } },
            progress: progress,
            max_points: max_points,
            n_points: n_points,
          },
        })
      },
    })
  },
})
//# sourceMappingURL=UserCourseProgress.js.map
