"use strict"
exports.__esModule = true
exports.generateSecret = void 0
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var apollo_server_core_1 = require("apollo-server-core")
var accessControl_1 = require("../accessControl")
var crypto_1 = require("crypto")
var util_1 = require("util")
var db_functions_1 = require("../util/db-functions")
nexus_1.schema.objectType({
  name: "Organization",
  definition: function (t) {
    t.model.id()
    t.model.contact_information()
    t.model.created_at()
    t.model.disabled()
    t.model.email()
    t.model.hidden()
    t.model.logo_content_type()
    t.model.logo_file_name()
    t.model.logo_file_size()
    t.model.logo_updated_at()
    t.model.phone()
    t.model.pinned()
    t.model.slug()
    t.model.tmc_created_at()
    t.model.tmc_updated_at()
    t.model.updated_at()
    t.model.verified()
    t.model.verified_at()
    t.model.website()
    t.model.creator_id()
    t.model.creator()
    t.model.completions_registered()
    t.model.courses()
    t.model.course_organizations()
    t.model.organization_translations()
    t.model.user_organizations()
    t.model.verified_users()
  },
})
var organizationPermission = function (_, args, ctx, _info) {
  if (args.hidden) return ctx.role === accessControl_1.Role.ADMIN
  return true
}
nexus_1.schema.extendType({
  type: "Query",
  definition: function (t) {
    var _this = this
    t.field("organization", {
      type: "Organization",
      args: {
        id: nexus_1.schema.idArg(),
        hidden: nexus_1.schema.booleanArg(),
      },
      authorize: organizationPermission,
      nullable: true,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var id, hidden, res
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(id = args.id), (hidden = args.hidden)
                if (!id) {
                  throw new apollo_server_core_1.UserInputError(
                    "must provide id",
                  )
                }
                return [
                  4 /*yield*/,
                  ctx.db.organization.findMany({
                    where: { id: id, hidden: hidden },
                  }),
                ]
              case 1:
                res = _a.sent()
                return [2 /*return*/, res.length ? res[0] : null]
            }
          })
        })
      },
    })
    t.crud.organizations({
      ordering: true,
      pagination: true,
      authorize: organizationPermission,
    })
    t.list.field("organizations", {
      type: "Organization",
      args: {
        take: nexus_1.schema.intArg(),
        skip: nexus_1.schema.intArg(),
        cursor: nexus_1.schema.arg({ type: "OrganizationWhereUniqueInput" }),
        /*first: schema.intArg(),
                after: schema.idArg(),
                last: schema.intArg(),
                before: schema.idArg(),*/
        orderBy: nexus_1.schema.arg({ type: "OrganizationOrderByInput" }),
        hidden: nexus_1.schema.booleanArg(),
      },
      authorize: organizationPermission,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var /*first, last, after, before, */ take,
            skip,
            cursor,
            orderBy,
            hidden,
            orgs
          var _a, _b
          return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
              case 0:
                ;(take = args.take),
                  (skip = args.skip),
                  (cursor = args.cursor),
                  (orderBy = args.orderBy),
                  (hidden = args.hidden)
                return [
                  4 /*yield*/,
                  ctx.db.organization.findMany({
                    take: take !== null && take !== void 0 ? take : undefined,
                    skip: skip !== null && skip !== void 0 ? skip : undefined,
                    cursor: cursor
                      ? {
                          id:
                            (_a = cursor.id) !== null && _a !== void 0
                              ? _a
                              : undefined,
                        }
                      : undefined,
                    /*first: first ?? undefined,
                                    last: last ?? undefined,
                                    after: after ? { id: after } : undefined,
                                    before: before ? { id: before } : undefined,*/
                    orderBy:
                      (_b = db_functions_1.filterNull(orderBy)) !== null &&
                      _b !== void 0
                        ? _b
                        : undefined,
                    where: {
                      hidden: hidden,
                    },
                  }),
                ]
              case 1:
                orgs = _c.sent()
                return [2 /*return*/, orgs]
            }
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
    t.field("addOrganization", {
      type: "Organization",
      args: {
        name: nexus_1.schema.stringArg(),
        slug: nexus_1.schema.stringArg({ required: true }),
      },
      authorize: accessControl_1.isAdmin,
      resolve: function (_, args, ctx) {
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var name, slug, secret, result, org
          return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                ;(name = args.name), (slug = args.slug)
                _a.label = 1
              case 1:
                return [4 /*yield*/, exports.generateSecret()]
              case 2:
                secret = _a.sent()
                return [
                  4 /*yield*/,
                  ctx.db.organization.findMany({
                    where: { secret_key: secret },
                  }),
                ]
              case 3:
                result = _a.sent()
                _a.label = 4
              case 4:
                if (result.length) return [3 /*break*/, 1]
                _a.label = 5
              case 5:
                return [
                  4 /*yield*/,
                  ctx.db.organization.create({
                    data: {
                      slug: slug,
                      secret_key: secret,
                      organization_translations: {
                        create: {
                          name: name !== null && name !== void 0 ? name : "",
                          language: "fi_FI",
                        },
                      },
                    },
                  }),
                  // FIXME: return value not used
                  /*await ctx.db.organization_translation.create({
                              data: {
                                name: name ?? "",
                                language: "fi_FI", //placeholder
                                organization_organizationToorganization_translation: {
                                  connect: { id: org.id },
                                },
                              },
                            })
                    
                            const newOrg = await ctx.db.organization.findOne({
                              where: { id: org.id },
                            })*/
                ]
              case 6:
                org = _a.sent()
                // FIXME: return value not used
                /*await ctx.db.organization_translation.create({
                              data: {
                                name: name ?? "",
                                language: "fi_FI", //placeholder
                                organization_organizationToorganization_translation: {
                                  connect: { id: org.id },
                                },
                              },
                            })
                    
                            const newOrg = await ctx.db.organization.findOne({
                              where: { id: org.id },
                            })*/
                return [2 /*return*/, org]
            }
          })
        })
      },
    })
  },
})
exports.generateSecret = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var randomBytesPromise
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          randomBytesPromise = util_1.promisify(crypto_1.randomBytes)
          return [4 /*yield*/, randomBytesPromise(128)]
        case 1:
          return [2 /*return*/, _a.sent().toString("hex")]
      }
    })
  })
}
//# sourceMappingURL=Organization.js.map
