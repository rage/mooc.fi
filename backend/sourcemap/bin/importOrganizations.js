"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
var tmc_1 = tslib_1.__importDefault(require("../services/tmc"))
var Organization_1 = require("../graphql/Organization")
var prisma_1 = tslib_1.__importDefault(require("./lib/prisma"))
var tmc = new tmc_1["default"]()
var prisma = prisma_1["default"]()
var fetchOrganizations = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var orgInfos
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, tmc.getOrganizations()]
        case 1:
          orgInfos = _a.sent()
          return [
            4 /*yield*/,
            Promise.all(
              orgInfos.map(function (p) {
                return upsertOrganization(p)
              }),
            ),
          ]
        case 2:
          _a.sent()
          return [2 /*return*/]
      }
    })
  })
}
var upsertOrganization = function (org) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var user,
      _a,
      details,
      existingOrganizations,
      organization,
      _b,
      _c,
      translationDetails,
      organizationTranslations,
      organizationTranslationId
    return tslib_1.__generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          if (!(org.creator_id != null)) return [3 /*break*/, 2]
          return [4 /*yield*/, getUserFromTmc(org.creator_id)]
        case 1:
          _a = _d.sent()
          return [3 /*break*/, 3]
        case 2:
          _a = null
          _d.label = 3
        case 3:
          user = _a
          details = {
            slug: org.slug,
            verified_at: org.verified_at,
            verified: org.verified || false,
            disabled: org.disabled || false,
            tmc_created_at: org.created_at,
            tmc_updated_at: org.updated_at,
            hidden: org.hidden || false,
            creator: user != null ? { connect: { id: user.id } } : null,
            logo_file_name: org.logo_file_name,
            logo_content_type: org.logo_content_type,
            logo_file_size: Number(org.logo_file_size),
            logo_updated_at: org.logo_updated_at,
            phone: org.phone,
            contact_information: org.contact_information,
            email: org.email,
            website: org.website,
            pinned: org.pinned || false,
          }
          return [
            4 /*yield*/,
            prisma.organization.findMany({
              where: {
                slug: org.slug,
              },
            }),
          ]
        case 4:
          existingOrganizations = _d.sent()
          if (!(existingOrganizations.length > 0)) return [3 /*break*/, 6]
          return [
            4 /*yield*/,
            prisma.organization.update({
              where: {
                slug: org.slug,
              },
              data: details,
            }),
          ]
        case 5:
          organization = _d.sent()
          return [3 /*break*/, 9]
        case 6:
          _c = (_b = prisma.organization).create
          return [4 /*yield*/, detailsWithSecret(details)]
        case 7:
          return [4 /*yield*/, _c.apply(_b, [_d.sent()])]
        case 8:
          organization = _d.sent()
          _d.label = 9
        case 9:
          translationDetails = {
            language: "fi_FI",
            name: org.name,
            disabled_reason: org.disabled_reason,
            information: org.information,
            organization: { connect: { id: organization.id } },
          }
          return [
            4 /*yield*/,
            prisma.organization
              .findOne({ where: { id: organization.id } })
              .organization_translations({
                where: { language: translationDetails.language },
              }),
          ]
        case 10:
          organizationTranslations = _d.sent()
          organizationTranslationId = organizationTranslations.length
            ? organizationTranslations[0].id
            : null
          if (!(organizationTranslationId != null)) return [3 /*break*/, 12]
          return [
            4 /*yield*/,
            prisma.organizationTranslation.update({
              where: { id: organizationTranslationId },
              data: translationDetails,
            }),
          ]
        case 11:
          _d.sent()
          return [3 /*break*/, 14]
        case 12:
          return [
            4 /*yield*/,
            prisma.organizationTranslation.create({ data: translationDetails }),
          ]
        case 13:
          _d.sent()
          _d.label = 14
        case 14:
          return [2 /*return*/]
      }
    })
  })
}
// FIXME: type
var detailsWithSecret = function (details) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _a = details
          return [4 /*yield*/, Organization_1.generateSecret()]
        case 1:
          _a.secret_key = _b.sent()
          return [2 /*return*/, details]
      }
    })
  })
}
var getUserFromTmc = function (user_id) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var details, prismaDetails
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, tmc.getUserDetailsById(user_id)]
        case 1:
          details = _a.sent()
          prismaDetails = {
            upstream_id: details.id,
            administrator: details.administrator,
            email: details.email.trim(),
            first_name: details.user_field.first_name.trim(),
            last_name: details.user_field.last_name.trim(),
            username: details.username,
          }
          return [
            4 /*yield*/,
            prisma.user.upsert({
              where: { upstream_id: details.id },
              create: prismaDetails,
              update: prismaDetails,
            }),
          ]
        case 2:
          return [2 /*return*/, _a.sent()]
      }
    })
  })
}
fetchOrganizations()
//# sourceMappingURL=importOrganizations.js.map
