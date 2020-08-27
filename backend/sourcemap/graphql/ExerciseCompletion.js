"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var accessControl_1 = require("../accessControl")
nexus_1.schema.objectType({
  name: "ExerciseCompletion",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.exercise_id()
    t.model.exercise()
    t.model.completed()
    t.model.n_points()
    t.model.timestamp()
    t.model.user_id()
    t.model.user()
    t.model.exercise_completion_required_actions()
  },
})
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    var _this = this
    t.field("exerciseCompletion", {
      type: "ExerciseCompletion",
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
              ctx.db.exerciseCompletion.findOne({
                where: { id: id },
              }),
            ]
          })
        })
      },
    })
    t.crud.exerciseCompletions({
      ordering: true,
      authorize: accessControl_1.isAdmin,
    })
    /*t.list.field("exerciseCompletions", {
          type: "exercise_completion",
          resolve: (_, __, ctx) => {
            checkAccess(ctx)
            return ctx.db.exercise_completion.findMany()
          },
        })*/
  },
})
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    t.field("addExerciseCompletion", {
      type: "ExerciseCompletion",
      args: {
        n_points: nexus_1.schema.intArg(),
        exercise: nexus_1.schema.idArg(),
        user: nexus_1.schema.idArg(),
        timestamp: nexus_1.schema.arg({ type: "DateTime" }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        var n_points = args.n_points,
          exercise = args.exercise,
          user = args.user,
          timestamp = args.timestamp
        return ctx.db.exerciseCompletion.create({
          data: {
            n_points: n_points,
            exercise: exercise ? { connect: { id: exercise } } : undefined,
            user: user ? { connect: { id: user } } : undefined,
            timestamp: timestamp,
          },
        })
      },
    })
  },
})
//# sourceMappingURL=ExerciseCompletion.js.map
