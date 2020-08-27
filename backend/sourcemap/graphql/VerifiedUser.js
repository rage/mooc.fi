"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var nexus_1 = require("nexus")
var apollo_server_core_1 = require("apollo-server-core")
nexus_1.schema.objectType({
  name: "VerifiedUser",
  definition: function (t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.display_name()
    t.model.organization_id()
    t.model.organization()
    t.model.personal_unique_code()
    t.model.user_id()
    t.model.user()
  },
})
nexus_1.schema.inputObjectType({
  name: "VerifiedUserArg",
  definition: function (t) {
    t.string("display_name")
    t.string("personal_unique_code", { required: true })
    t.id("organization_id", { required: true })
    t.string("organization_secret", { required: true })
  },
})
nexus_1.schema.extendType({
  type: "Mutation",
  definition: function (t) {
    var _this = this
    t.field("addVerifiedUser", {
      type: "VerifiedUser",
      args: {
        verified_user: nexus_1.schema.arg({
          type: "VerifiedUserArg",
          required: true,
        }),
      },
      resolve: function (_, _a, ctx) {
        var verified_user = _a.verified_user
        return tslib_1.__awaiter(_this, void 0, void 0, function () {
          var organization_id,
            display_name,
            personal_unique_code,
            organization_secret,
            currentUser,
            organization
          return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                ;(organization_id = verified_user.organization_id),
                  (display_name = verified_user.display_name),
                  (personal_unique_code = verified_user.personal_unique_code),
                  (organization_secret = verified_user.organization_secret)
                currentUser = ctx.user
                if (!currentUser) {
                  throw new apollo_server_core_1.AuthenticationError(
                    "not logged in",
                  )
                }
                return [
                  4 /*yield*/,
                  ctx.db.organization.findOne({
                    where: { id: organization_id },
                  }),
                ]
              case 1:
                organization = _b.sent()
                if (
                  !organization ||
                  !(organization === null || organization === void 0
                    ? void 0
                    : organization.secret_key)
                ) {
                  throw new apollo_server_core_1.ForbiddenError(
                    "no organization or organization secret",
                  )
                }
                if (organization.secret_key !== organization_secret) {
                  throw new apollo_server_core_1.ForbiddenError(
                    "wrong organization secret key",
                  )
                }
                return [
                  2 /*return*/,
                  ctx.db.verifiedUser.create({
                    data: {
                      organization: {
                        connect: { id: organization.id },
                      },
                      user: { connect: { id: currentUser.id } },
                      personal_unique_code: personal_unique_code,
                      display_name: display_name,
                    },
                  }),
                ]
            }
          })
        })
      },
    })
  },
})
//# sourceMappingURL=VerifiedUser.js.map
