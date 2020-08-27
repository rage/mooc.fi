"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var accessControl_1 = require("../accessControl")
nexus_1.schema.objectType({
  name: "CourseOrganization",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.creator()
    t.model.organization_id()
    t.model.organization()
  },
})
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    var _this = this
    t.list.field("courseOrganizations", {
      type: "CourseOrganization",
      args: {
        course_id: nexus_1.schema.idArg(),
        organization_id: nexus_1.schema.idArg(),
      },
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var course_id, organization_id
          return tslib_1.__generator(this, function (_a) {
            ;(course_id = args.course_id),
              (organization_id = args.organization_id)
            return [
              2 /*return*/,
              ctx.db.courseOrganization.findMany({
                where: {
                  course_id:
                    course_id !== null && course_id !== void 0
                      ? course_id
                      : undefined,
                  organization_id:
                    organization_id !== null && organization_id !== void 0
                      ? organization_id
                      : undefined,
                },
              }),
            ]
          })
        })
      },
    })
  },
})
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addCourseOrganization", {
      type: "CourseOrganization",
      args: {
        course_id: nexus_1.schema.idArg({ required: true }),
        organization_id: nexus_1.schema.idArg({ required: true }),
        creator: nexus_1.schema.booleanArg(),
      },
      authorize: accessControl_1.or(
        accessControl_1.isVisitor,
        accessControl_1.isAdmin,
      ),
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var course_id, organization_id, creator, exists
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(course_id = args.course_id),
                  (organization_id = args.organization_id),
                  (creator = args.creator)
                return [
                  4 /*yield*/,
                  ctx.db.courseOrganization.findMany({
                    where: {
                      course_id: course_id,
                      organization_id: organization_id,
                    },
                  }),
                ]
              case 1:
                exists = _a.sent()
                if (exists.length > 0) {
                  throw new Error(
                    "this course/organization relation already exists",
                  )
                }
                return [
                  2 /*return*/,
                  ctx.db.courseOrganization.create({
                    data: {
                      course: { connect: { id: course_id } },
                      organization: {
                        connect: { id: organization_id },
                      },
                      creator: creator ? creator : false,
                    },
                  }),
                ]
            }
          })
        })
      },
    })
    t.field("deleteCourseOrganization", {
      type: "CourseOrganization",
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
              ctx.db.courseOrganization["delete"]({ where: { id: id } }),
            ]
          })
        })
      },
    })
  },
})
//# sourceMappingURL=CourseOrganization.js.map
