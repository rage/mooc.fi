"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var generateUserCourseProgress_1 = require("./kafkaConsumer/userCourseProgressConsumer/generateUserCourseProgress")
var prisma_1 = tslib_1.__importDefault(require("./lib/prisma"))
var BATCH_SIZE = 100
var prisma = prisma_1["default"]()
var sendEmail = function (emailDelivery) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a, user, email_template, e_1
    var _b
    return tslib_1.__generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.emailDelivery.findOne({
              where: { id: emailDelivery.id },
              select: {
                user: true,
                email_template: true,
              },
            }),
          ]
        case 1:
          ;(_a = (_b = _c.sent()) !== null && _b !== void 0 ? _b : {}),
            (user = _a.user),
            (email_template = _a.email_template)
          if (!email_template || !user) {
            // TODO: should this update the delivery with error?
            console.error("No email template or user found while sending email")
            return [2 /*return*/]
          }
          /*const user = await prisma.email_delivery.findOne({ where: { id: emailDelivery.id } }).user_email_deliveryTouser()
                const emailTemplate = await prisma
                  .email_delivery.findOne({ where: { id: emailDelivery.id } })
                  .email_template_email_deliveryToemail_template()*/
          console.log(
            "Delivering email " + email_template.name + " to " + user.email,
          )
          _c.label = 2
        case 2:
          _c.trys.push([2, 5, , 7])
          return [
            4 /*yield*/,
            generateUserCourseProgress_1.sendEmailTemplateToUser(
              user,
              email_template,
            ),
          ]
        case 3:
          _c.sent()
          console.log("Marking email as delivered")
          return [
            4 /*yield*/,
            prisma.emailDelivery.update({
              where: { id: emailDelivery.id },
              data: { sent: true, error: false },
            }),
          ]
        case 4:
          _c.sent()
          return [3 /*break*/, 7]
        case 5:
          e_1 = _c.sent()
          console.error("Sending failed", e_1.message)
          return [
            4 /*yield*/,
            prisma.emailDelivery.update({
              where: { id: emailDelivery.id },
              data: { error: true, error_message: e_1.message },
            }),
          ]
        case 6:
          _c.sent()
          return [3 /*break*/, 7]
        case 7:
          return [2 /*return*/]
      }
    })
  })
}
var main = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var emailsToDeliver, _i, emailsToDeliver_1, emailDelivery
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!true) return [3 /*break*/, 7]
          return [
            4 /*yield*/,
            prisma.emailDelivery.findMany({
              where: { sent: false, error: false },
              take: BATCH_SIZE,
            }),
          ]
        case 1:
          emailsToDeliver = _a.sent()
          if (emailsToDeliver.length > 0) {
            console.log(
              "Received a batch of " +
                emailsToDeliver.length +
                " emails to send.",
            )
          }
          ;(_i = 0), (emailsToDeliver_1 = emailsToDeliver)
          _a.label = 2
        case 2:
          if (!(_i < emailsToDeliver_1.length)) return [3 /*break*/, 5]
          emailDelivery = emailsToDeliver_1[_i]
          return [4 /*yield*/, sendEmail(emailDelivery)]
        case 3:
          _a.sent()
          _a.label = 4
        case 4:
          _i++
          return [3 /*break*/, 2]
        case 5:
          return [
            4 /*yield*/,
            new Promise(function (resolve) {
              return setTimeout(resolve, 1000)
            }),
          ]
        case 6:
          _a.sent()
          return [3 /*break*/, 0]
        case 7:
          return [2 /*return*/]
      }
    })
  })
}
main()
//# sourceMappingURL=backgroundEmailer.js.map
