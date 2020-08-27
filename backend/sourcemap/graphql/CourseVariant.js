"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var accessControl_1 = require("../accessControl")
nexus_1.schema.objectType({
  name: "CourseVariant",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.description()
    t.model.slug()
  },
})
nexus_1.schema.inputObjectType({
  name: "CourseVariantCreateInput",
  definition: function (t) {
    t.id("course", { required: false })
    t.string("slug", { required: true })
    t.string("description", { required: false })
  },
})
nexus_1.schema.inputObjectType({
  name: "CourseVariantUpsertInput",
  definition: function (t) {
    t.id("id", { required: false })
    t.id("course", { required: false })
    t.string("slug", { required: true })
    t.string("description", { required: false })
  },
})
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    t.field("courseVariant", {
      type: "CourseVariant",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
      },
      nullable: true,
      resolve: function (_, _a, ctx) {
        var id = _a.id
        return ctx.db.courseVariant.findOne({
          where: { id: id !== null && id !== void 0 ? id : undefined },
        })
      },
    })
    t.list.field("courseVariants", {
      type: "CourseVariant",
      args: {
        course_id: nexus_1.schema.idArg(),
      },
      resolve: function (_, _a, ctx) {
        var course_id = _a.course_id
        return ctx.db.course
          .findOne({
            where: {
              id:
                course_id !== null && course_id !== void 0
                  ? course_id
                  : undefined,
            },
          })
          .course_variants()
      },
    })
  },
})
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addCourseVariant", {
      type: "CourseVariant",
      args: {
        course_id: nexus_1.schema.idArg({ required: true }),
        slug: nexus_1.schema.stringArg({ required: true }),
        description: nexus_1.schema.stringArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var course_id, slug, description
          return tslib_1.__generator(this, function (_a) {
            ;(course_id = args.course_id),
              (slug = args.slug),
              (description = args.description)
            return [
              2 /*return*/,
              ctx.db.courseVariant.create({
                data: {
                  slug: slug,
                  description: description,
                  course: { connect: { id: course_id } },
                },
              }),
            ]
          })
        })
      },
    })
    t.field("updateCourseVariant", {
      type: "CourseVariant",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
        slug: nexus_1.schema.stringArg(),
        description: nexus_1.schema.stringArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var id, slug, description
          return tslib_1.__generator(this, function (_a) {
            ;(id = args.id),
              (slug = args.slug),
              (description = args.description)
            return [
              2 /*return*/,
              ctx.db.courseVariant.update({
                where: { id: id },
                data: {
                  slug: slug !== null && slug !== void 0 ? slug : undefined,
                  description: description,
                },
              }),
            ]
          })
        })
      },
    })
    t.field("deleteCourseVariant", {
      type: "CourseVariant",
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
              ctx.db.courseVariant["delete"]({ where: { id: id } }),
            ]
          })
        })
      },
    })
  },
})
//# sourceMappingURL=CourseVariant.js.map
