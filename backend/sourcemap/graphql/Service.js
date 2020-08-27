"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var accessControl_1 = require("../accessControl")
nexus_1.schema.objectType({
  name: "Service",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.name()
    t.model.url()
    t.model.exercises()
    t.model.user_course_service_progresses()
    t.model.courses()
  },
})
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    var _this = this
    t.field("service", {
      type: "Service",
      args: {
        service_id: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var service_id = _a.service_id
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          return tslib_1.__generator(this, function (_b) {
            return [
              2 /*return*/,
              ctx.db.service.findOne({ where: { id: service_id } }),
            ]
          })
        })
      },
    })
    t.crud.services({
      pagination: false,
      authorize: accessControl_1.isAdmin,
    })
    /*t.list.field("services", {
          type: "service",
          resolve: (_, __, ctx) => {
            checkAccess(ctx)
    
            return ctx.db.service.findMany()
          },
        })*/
  },
})
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addService", {
      type: "Service",
      args: {
        url: nexus_1.schema.stringArg({ required: true }),
        name: nexus_1.schema.stringArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var url, name
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(url = args.url), (name = args.name)
                return [
                  4 /*yield*/,
                  ctx.db.service.create({
                    data: {
                      url: url,
                      name: name,
                    },
                  }),
                ]
              case 1:
                return [2 /*return*/, _a.sent()]
            }
          })
        })
      },
    })
    t.field("updateService", {
      type: "Service",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
        url: nexus_1.schema.stringArg(),
        name: nexus_1.schema.stringArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        var url = args.url,
          name = args.name,
          id = args.id
        return ctx.db.service.update({
          where: { id: id },
          data: {
            url: url !== null && url !== void 0 ? url : "",
            name: name !== null && name !== void 0 ? name : "",
          },
        })
      },
    })
  },
})
//# sourceMappingURL=Service.js.map
