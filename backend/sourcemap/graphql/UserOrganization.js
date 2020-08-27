"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var apollo_server_core_1 = require("apollo-server-core")
var accessControl_1 = require("../accessControl")
var client_1 = require("@prisma/client")
nexus_1.schema.objectType({
  name: "UserOrganization",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.organization_id()
    t.model.organization()
    t.model.role()
    t.model.user_id()
    t.model.user()
  },
})
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    var _this = this
    t.list.field("userOrganizations", {
      type: "UserOrganization",
      args: {
        user_id: nexus_1.schema.idArg(),
        organization_id: nexus_1.schema.idArg(),
      },
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var user_id, organization_id
          return tslib_1.__generator(this, function (_a) {
            ;(user_id = args.user_id), (organization_id = args.organization_id)
            if (!user_id && !organization_id) {
              throw new Error(
                "must provide at least one of user/organization id",
              )
            }
            return [
              2 /*return*/,
              ctx.db.userOrganization.findMany({
                where: {
                  user_id: user_id,
                  organization_id: organization_id,
                },
              }),
            ]
          })
        })
      },
    })
  },
})
var checkUser = function (ctx, id) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var user, role, existingUser, _a
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ;(user = ctx.user), (role = ctx.role)
          _b.label = 1
        case 1:
          _b.trys.push([1, 3, , 4])
          return [
            4 /*yield*/,
            ctx.db.userOrganization.findOne({ where: { id: id } }).user(),
          ]
        case 2:
          existingUser = _b.sent()
          return [3 /*break*/, 4]
        case 3:
          _a = _b.sent()
          throw new Error("no such user/organization relation")
        case 4:
          if (!existingUser) {
            throw new Error("relation has no user - wonder how that happened")
          }
          if (
            !user ||
            (user &&
              user.id !== existingUser.id &&
              role !== accessControl_1.Role.ADMIN)
          ) {
            throw new apollo_server_core_1.ForbiddenError(
              "invalid credentials to do that",
            )
          }
          return [2 /*return*/]
      }
    })
  })
}
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addUserOrganization", {
      type: "UserOrganization",
      args: {
        user_id: nexus_1.schema.idArg({ required: true }),
        organization_id: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.or(
        accessControl_1.isVisitor,
        accessControl_1.isAdmin,
      ),
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var user_id, organization_id, exists
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(user_id = args.user_id),
                  (organization_id = args.organization_id)
                return [
                  4 /*yield*/,
                  ctx.db.userOrganization.findMany({
                    where: {
                      user_id: user_id,
                      organization_id: organization_id,
                    },
                  }),
                ]
              case 1:
                exists = _a.sent().length > 0
                if (exists) {
                  throw new Error(
                    "this user/organization relation already exists",
                  )
                }
                return [
                  2 /*return*/,
                  ctx.db.userOrganization.create({
                    data: {
                      user: { connect: { id: user_id } },
                      organization: {
                        connect: { id: organization_id },
                      },
                      role: client_1.OrganizationRole.Student,
                    },
                  }),
                ]
            }
          })
        })
      },
    })
    t.field("updateUserOrganization", {
      type: "UserOrganization",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
        /*       userId: schema.idArg(),
                organizationId: schema.idArg(), */
        role: nexus_1.schema.arg({ type: "OrganizationRole" }),
      },
      authorize: accessControl_1.or(
        accessControl_1.isVisitor,
        accessControl_1.isAdmin,
      ),
      resolve: function (_, args, ctx) {
        var id = args.id,
          role = args.role
        checkUser(ctx, id)
        return ctx.db.userOrganization.update({
          data: {
            role: role ? role : client_1.OrganizationRole.Student,
          },
          where: {
            id: id,
          },
        })
      },
    })
    t.field("deleteUserOrganization", {
      type: "UserOrganization",
      args: {
        id: nexus_1.schema.idArg({ required: true }),
      },
      authorize: accessControl_1.or(
        accessControl_1.isVisitor,
        accessControl_1.isAdmin,
      ),
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var id
          return tslib_1.__generator(this, function (_a) {
            id = args.id
            checkUser(ctx, id)
            return [
              2 /*return*/,
              ctx.db.userOrganization["delete"]({
                where: { id: id },
              }),
            ]
          })
        })
      },
    })
  },
})
//# sourceMappingURL=UserOrganization.js.map
