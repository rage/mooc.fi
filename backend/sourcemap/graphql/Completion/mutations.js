"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var knex_1 = tslib_1.__importDefault(require("../../services/knex"))
var accessControl_1 = require("../../accessControl")
var uuid_1 = require("uuid")
var lodash_1 = require("lodash")
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addCompletion", {
      type: "Completion",
      args: {
        user_upstream_id: nexus_1.schema.intArg(),
        email: nexus_1.schema.stringArg(),
        student_number: nexus_1.schema.stringArg(),
        user: nexus_1.schema.idArg({ required: true }),
        course: nexus_1.schema.idArg({ required: true }),
        completion_language: nexus_1.schema.stringArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        var user_upstream_id = args.user_upstream_id,
          email = args.email,
          student_number = args.student_number,
          user = args.user,
          course = args.course,
          completion_language = args.completion_language
        return ctx.db.completion.create({
          data: {
            course: { connect: { id: course } },
            user: { connect: { id: user } },
            email: email !== null && email !== void 0 ? email : "",
            student_number: student_number,
            completion_language: completion_language,
            user_upstream_id: user_upstream_id,
          },
        })
      },
    })
    t.list.field("addManualCompletion", {
      type: "Completion",
      args: {
        completions: nexus_1.schema.arg({
          type: "ManualCompletionArg",
          list: true,
        }),
        course_id: nexus_1.schema.stringArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, _ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var course_id,
            course,
            completions,
            foundUsers,
            databaseUsersByUpstreamId,
            newCompletions,
            newEmailDeliveries,
            res
          var _this = this
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                course_id = args.course_id
                return [
                  4 /*yield*/,
                  knex_1["default"]
                    .select(["id", "completion_email_id"])
                    .from("course")
                    .where("id", course_id)
                    .limit(1),
                ]
              case 1:
                course = _a.sent()[0]
                if (!course) {
                  throw new Error("Course not found")
                }
                completions = args.completions || []
                return [
                  4 /*yield*/,
                  knex_1["default"]
                    .select([
                      "id",
                      "email",
                      "upstream_id",
                      "student_number",
                      "real_student_number",
                    ])
                    .from("user")
                    .whereIn(
                      "upstream_id",
                      completions.map(function (o) {
                        return o.user_id
                      }),
                    ),
                ]
              case 2:
                foundUsers = _a.sent()
                if (foundUsers.length !== completions.length) {
                  throw new Error("All users were not found")
                }
                databaseUsersByUpstreamId = lodash_1.groupBy(
                  foundUsers,
                  "upstream_id",
                )
                newCompletions = completions.map(function (o) {
                  var databaseUser = databaseUsersByUpstreamId[o.user_id][0]
                  return {
                    id: uuid_1.v4(),
                    created_at: new Date(),
                    updated_at: new Date(),
                    user_upstream_id: o.user_id,
                    email: databaseUser.email,
                    student_number:
                      databaseUser.real_student_number ||
                      databaseUser.student_number,
                    completion_language: "unknown",
                    course_id: course_id,
                    user_id: databaseUser.id,
                    grade: o.grade,
                    completion_date: o.completion_date,
                  }
                })
                newEmailDeliveries = completions.map(function (o) {
                  var databaseUser = databaseUsersByUpstreamId[o.user_id][0]
                  return {
                    id: uuid_1.v4(),
                    created_at: new Date(),
                    updated_at: new Date(),
                    user_id: databaseUser.id,
                    email_template_id: course.completion_email_id,
                    sent: false,
                    error: false,
                  }
                })
                return [
                  4 /*yield*/,
                  knex_1["default"].transaction(function (trx) {
                    return tslib_1.__awaiter(
                      _this,
                      void 0,
                      void 0,
                      function () {
                        var inserted
                        return tslib_1.__generator(this, function (_a) {
                          switch (_a.label) {
                            case 0:
                              return [
                                4 /*yield*/,
                                trx
                                  .batchInsert("completion", newCompletions)
                                  .returning("*"),
                              ]
                            case 1:
                              inserted = _a.sent()
                              if (!course.completion_email_id)
                                return [3 /*break*/, 3]
                              return [
                                4 /*yield*/,
                                trx.batchInsert(
                                  "email_delivery",
                                  newEmailDeliveries,
                                ),
                              ]
                            case 2:
                              _a.sent()
                              _a.label = 3
                            case 3:
                              return [2 /*return*/, inserted]
                          }
                        })
                      },
                    )
                  }),
                ]
              case 3:
                res = _a.sent()
                return [2 /*return*/, res]
            }
          })
        })
      },
    })
  },
})
//# sourceMappingURL=mutations.js.map
