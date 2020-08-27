"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var accessControl_1 = require("../accessControl")
var db_functions_1 = require("../util/db-functions")
nexus_1.schema.objectType({
  name: "Exercise",
  definition: function (t) {
    var _this = this
    t.model.id()
    t.model.course_id()
    t.model.course()
    t.model.created_at()
    t.model.custom_id()
    t.model.deleted()
    t.model.max_points()
    t.model.name()
    t.model.part()
    t.model.section()
    t.model.service_id()
    t.model.service()
    t.model.timestamp()
    t.model.updated_at()
    // t.prismaFields({ filter: ["exercise_completions"] })
    t.field("exercise_completions", {
      type: "ExerciseCompletion",
      list: true,
      args: {
        orderBy: nexus_1.schema.arg({
          // FIXME?
          type: "ExerciseCompletionOrderByInput",
          required: false,
        }),
      },
      resolve: function (parent, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var orderBy
          var _a, _b
          return tslib_1.__generator(this, function (_c) {
            orderBy = args.orderBy
            return [
              2 /*return*/,
              ctx.db.exercise
                .findOne({ where: { id: parent.id } })
                .exercise_completions({
                  where: {
                    // @ts-ignore: context typing problem, FIXME
                    user_id:
                      (_a =
                        ctx === null || ctx === void 0 ? void 0 : ctx.user) ===
                        null || _a === void 0
                        ? void 0
                        : _a.id,
                  },
                  orderBy:
                    (_b = db_functions_1.filterNull(orderBy)) !== null &&
                    _b !== void 0
                      ? _b
                      : undefined,
                }),
            ]
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
    t.field("exercise", {
      type: "Exercise",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var id = _a.id
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          return tslib_1.__generator(this, function (_b) {
            return [
              2 /*return*/,
              ctx.db.exercise.findOne({
                where: { id: id },
              }),
            ]
          })
        })
      },
    })
    t.crud.exercises({
      authorize: accessControl_1.isAdmin,
    })
    /*t.list.field("exercises", {
          type: "exercise",
          resolve: (_, __, ctx) => {
            checkAccess(ctx)
            return ctx.db.exercise.findMany()
          },
        })*/
  },
})
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    t.field("addExercise", {
      type: "Exercise",
      args: {
        custom_id: nexus_1.schema.stringArg(),
        name: nexus_1.schema.stringArg(),
        part: nexus_1.schema.intArg(),
        section: nexus_1.schema.intArg(),
        max_points: nexus_1.schema.intArg(),
        course: nexus_1.schema.idArg(),
        service: nexus_1.schema.idArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        var custom_id = args.custom_id,
          name = args.name,
          part = args.part,
          section = args.section,
          max_points = args.max_points,
          course = args.course,
          service = args.service
        ctx.db
        return ctx.db.exercise.create({
          data: {
            course: course ? { connect: { id: course } } : undefined,
            service: service ? { connect: { id: service } } : undefined,
            custom_id:
              custom_id !== null && custom_id !== void 0 ? custom_id : "",
            name: name,
            max_points: max_points,
            part: part,
            section: section,
          },
        })
      },
    })
  },
})
//# sourceMappingURL=Exercise.js.map
