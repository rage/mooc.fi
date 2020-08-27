"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var apollo_server_core_1 = require("apollo-server-core")
var accessControl_1 = require("../accessControl")
nexus_1.schema.objectType({
  name: "EmailTemplate",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.html_body()
    t.model.name()
    t.model.title()
    t.model.txt_body()
    t.model.courses()
    t.model.email_deliveries()
  },
})
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    t.field("email_template", {
      type: "EmailTemplate",
      nullable: true,
      args: {
        id: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var id = _a.id
        return ctx.db.emailTemplate.findOne({
          where: {
            id: id,
          },
        })
      },
    })
    t.list.field("email_templates", {
      type: "EmailTemplate",
      authorize: accessControl_1.isAdmin,
      resolve: function (_, __, ctx) {
        return ctx.db.emailTemplate.findMany()
      },
    })
  },
})
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addEmailTemplate", {
      type: "EmailTemplate",
      args: {
        name: nexus_1.schema.stringArg({ required: true }),
        html_body: nexus_1.schema.stringArg(),
        txt_body: nexus_1.schema.stringArg(),
        title: nexus_1.schema.stringArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        var name = args.name,
          html_body = args.html_body,
          txt_body = args.txt_body,
          title = args.title
        if (name == "")
          throw new apollo_server_core_1.UserInputError("Name is empty!")
        return ctx.db.emailTemplate.create({
          data: {
            name: name,
            html_body: html_body,
            txt_body: txt_body,
            title: title,
          },
        })
      },
    })
    t.field("updateEmailTemplate", {
      type: "EmailTemplate",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
        name: nexus_1.schema.stringArg(),
        html_body: nexus_1.schema.stringArg(),
        txt_body: nexus_1.schema.stringArg(),
        title: nexus_1.schema.stringArg(),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var id, name, html_body, txt_body, title
          return tslib_1.__generator(this, function (_a) {
            ;(id = args.id),
              (name = args.name),
              (html_body = args.html_body),
              (txt_body = args.txt_body),
              (title = args.title)
            return [
              2 /*return*/,
              ctx.db.emailTemplate.update({
                where: {
                  id: id,
                },
                data: {
                  name: name,
                  html_body: html_body,
                  txt_body: txt_body,
                  title: title,
                },
              }),
            ]
          })
        })
      },
    })
    t.field("deleteEmailTemplate", {
      type: "EmailTemplate",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, _a, ctx) {
        var id = _a.id
        return ctx.db.emailTemplate["delete"]({ where: { id: id } })
      },
    })
  },
})
//# sourceMappingURL=EmailTemplate.js.map
