"use strict"
exports.__esModule = true
exports.CheckCompletion = exports.sendEmailTemplateToUser = exports.generateUserCourseProgress = void 0
var tslib_1 = require("tslib")
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
var knex_1 = tslib_1.__importDefault(require("../../../services/knex"))
var nodemailer = tslib_1.__importStar(require("nodemailer"))
var EmailTemplater_1 = require("../common/EmailTemplater/EmailTemplater")
var wsServer_1 = require("../../../wsServer")
var prisma_1 = tslib_1.__importDefault(require("../../lib/prisma"))
var prisma = prisma_1["default"]()
var email_host = process.env.SMTP_HOST
var email_user = process.env.SMTP_USER
var email_pass = process.env.SMTP_PASS
var email_port = process.env.SMTP_PORT
var email_from = process.env.SMTP_FROM
/******************************************************/
exports.generateUserCourseProgress = function (_a) {
  var user = _a.user,
    course = _a.course,
    userCourseProgress = _a.userCourseProgress
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var combined
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, GetCombinedUserCourseProgress(user, course)]
        case 1:
          combined = _b.sent()
          return [4 /*yield*/, exports.CheckCompletion(user, course, combined)]
        case 2:
          _b.sent()
          return [
            4 /*yield*/,
            prisma.userCourseProgress.update({
              where: { id: userCourseProgress.id },
              data: {
                progress: combined.progress,
                max_points: combined.total_max_points,
                n_points: combined.total_n_points,
              },
            }),
          ]
        case 3:
          _b.sent()
          return [2 /*return*/]
      }
    })
  })
}
/******************************************************/
function sendEmailTemplateToUser(user, template) {
  var _a, _b
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var options, transporter, info, _c, _d
    var _e
    return tslib_1.__generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          options = {
            host: email_host,
            port: parseInt(email_port || ""),
            secure: false,
            auth: {
              user: email_user,
              pass: email_pass,
            },
          }
          transporter = nodemailer.createTransport(options)
          _d = (_c = transporter).sendMail
          _e = {
            from: email_from,
            to: user.email,
            subject:
              (_a = template.title) !== null && _a !== void 0 ? _a : undefined,
          }
          return [4 /*yield*/, ApplyTemplate(template, user)]
        case 1:
          return [
            4 /*yield*/,
            _d.apply(_c, [
              ((_e.text = _f.sent()),
              (_e.html =
                (_b = template.html_body) !== null && _b !== void 0
                  ? _b
                  : undefined),
              _e),
            ]),
          ]
        case 2:
          info = _f.sent()
          console.log("Message sent: %s", info.messageId)
          return [2 /*return*/]
      }
    })
  })
}
exports.sendEmailTemplateToUser = sendEmailTemplateToUser
var ApplyTemplate = function (email_template, user) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var templater
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          templater = new EmailTemplater_1.EmailTemplater(
            email_template,
            user,
            prisma,
          )
          return [4 /*yield*/, templater.resolve()]
        case 1:
          return [2 /*return*/, _a.sent()]
      }
    })
  })
}
var GetCombinedUserCourseProgress = function (user, course) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var userCourseServiceProgresses, progresses, combined
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.userCourseServiceProgress.findMany({
              where: {
                user_id: user === null || user === void 0 ? void 0 : user.id,
                course_id:
                  course === null || course === void 0 ? void 0 : course.id,
              },
            }),
            /*
             * Get rid of everything we dont neeed. After this the array looks like this:
             * [(serviceProgress)[[part1],[part2], ...], (anotherServiceProgress)[part1], [part2], ...]
             * It is still 2-dimensional!
             */
          ]
        case 1:
          userCourseServiceProgresses = _a.sent()
          progresses = userCourseServiceProgresses.map(function (entry) {
            return entry.progress
          })
          combined = new CombinedUserCourseProgress()
          progresses.forEach(function (entry) {
            entry.forEach(function (p) {
              combined.addProgress(p)
            })
          })
          return [2 /*return*/, combined]
      }
    })
  })
}
var CheckRequiredExerciseCompletions = function (user, course) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var exercise_completions
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!course.exercise_completions_needed) return [3 /*break*/, 2]
          return [
            4 /*yield*/,
            knex_1["default"]("exercise_completion")
              .countDistinct("exercise_completion.exercise_id")
              .join("exercise", {
                "exercise_completion.exercise_id": "exercise.id",
              })
              .where("exercise.course_id", course.id)
              .andWhere("exercise_completion.user_id", user.id)
              .andWhere("exercise_completion.completed", true)
              .andWhereNot("exercise.max_points", 0),
          ]
        case 1:
          exercise_completions = _a.sent()
          return [
            2 /*return*/,
            exercise_completions[0].count >= course.exercise_completions_needed,
          ]
        case 2:
          return [2 /*return*/, true]
      }
    })
  })
}
var GetUserCourseSettings = function (user, course) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var userCourseSetting, inheritCourse
    var _a
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.userCourseSetting.findMany({
              where: {
                user_id: user.id,
                course_id: course.id,
              },
            }),
          ]
        case 1:
          userCourseSetting =
            ((_a = _b.sent()) === null || _a === void 0 ? void 0 : _a[0]) ||
            null
          if (!!userCourseSetting) return [3 /*break*/, 4]
          return [
            4 /*yield*/,
            prisma.course
              .findOne({ where: { id: course.id } })
              .inherit_settings_from(),
          ]
        case 2:
          inheritCourse = _b.sent()
          if (!inheritCourse) return [3 /*break*/, 4]
          return [
            4 /*yield*/,
            prisma.userCourseSetting.findMany({
              where: {
                user_id: user.id,
                course_id: inheritCourse.id,
              },
            }),
          ]
        case 3:
          userCourseSetting = _b.sent()[0] || null
          _b.label = 4
        case 4:
          return [2 /*return*/, userCourseSetting]
      }
    })
  })
}
var languageCodeMapping = {
  fi: "fi_FI",
  en: "en_US",
  se: "sv_SE",
  ee: "et_EE",
  de: "de_DE",
  fr: "fr_FR",
  it: "it_IT",
  hu: "hu_HU",
  lv: "lv_LV",
  da: "da_DK",
  nl: "nl_NL",
  hr: "hr_HR",
  lt: "lt_LT",
  ga: "ga_IE",
  bg: "bg_BG",
  cs: "cs_CZ",
  el: "el_GR",
  mt: "mt_MT",
  pt: "pt_PT",
  ro: "ro_RO",
  sk: "sk_SK",
  sl: "sl_SI",
  no: "nb_NO",
}
exports.CheckCompletion = function (user, course, combinedProgress) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var combined,
      requiredExerciseCompletions,
      userCourseSettings,
      handlerCourse,
      otherHandlerCourse,
      completions,
      template
    var _a
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          combined = combinedProgress
          if (!!combined) return [3 /*break*/, 2]
          return [4 /*yield*/, GetCombinedUserCourseProgress(user, course)]
        case 1:
          combined = _b.sent()
          _b.label = 2
        case 2:
          return [4 /*yield*/, CheckRequiredExerciseCompletions(user, course)]
        case 3:
          requiredExerciseCompletions = _b.sent()
          return [4 /*yield*/, GetUserCourseSettings(user, course)]
        case 4:
          userCourseSettings = _b.sent()
          if (
            !(
              course.automatic_completions &&
              combined.total_n_points >=
                ((_a = course.points_needed) !== null && _a !== void 0
                  ? _a
                  : 9999999) &&
              requiredExerciseCompletions
            )
          )
            return [3 /*break*/, 10]
          handlerCourse = course
          return [
            4 /*yield*/,
            prisma.course
              .findOne({ where: { id: course.id } })
              .completions_handled_by(),
          ]
        case 5:
          otherHandlerCourse = _b.sent()
          if (otherHandlerCourse) {
            handlerCourse = otherHandlerCourse
          }
          return [
            4 /*yield*/,
            prisma.completion.findMany({
              where: {
                user_id: user.id,
                course_id:
                  handlerCourse === null || handlerCourse === void 0
                    ? void 0
                    : handlerCourse.id,
              },
            }),
          ]
        case 6:
          completions = _b.sent()
          if (!(completions.length < 1)) return [3 /*break*/, 10]
          return [
            4 /*yield*/,
            prisma.completion.create({
              data: {
                course: { connect: { id: handlerCourse.id } },
                email: user.email,
                user: { connect: { id: user.id } },
                user_upstream_id: user.upstream_id,
                student_number: user.student_number,
                completion_language: (
                  userCourseSettings === null || userCourseSettings === void 0
                    ? void 0
                    : userCourseSettings.language
                )
                  ? languageCodeMapping[userCourseSettings.language]
                  : "unknown",
                eligible_for_ects:
                  handlerCourse.automatic_completions_eligible_for_ects,
                completion_date: new Date(),
              },
            }),
          ]
        case 7:
          _b.sent()
          wsServer_1.pushMessageToClient(
            user.upstream_id,
            course.id,
            wsServer_1.MessageType.COURSE_CONFIRMED,
          )
          return [
            4 /*yield*/,
            prisma.course
              .findOne({ where: { id: course.id } })
              .completion_email(),
          ]
        case 8:
          template = _b.sent()
          if (!template) return [3 /*break*/, 10]
          return [4 /*yield*/, sendEmailTemplateToUser(user, template)]
        case 9:
          _b.sent()
          _b.label = 10
        case 10:
          return [2 /*return*/]
      }
    })
  })
}
var CombinedUserCourseProgress = /** @class */ (function () {
  function CombinedUserCourseProgress() {
    this.progress = []
    this.total_max_points = 0
    this.total_n_points = 0
  }
  CombinedUserCourseProgress.prototype.addProgress = function (newProgress) {
    this.total_max_points += newProgress.max_points
    this.total_n_points += newProgress.n_points
    var index = this.groupIndex(newProgress.group)
    if (index < 0) {
      this.progress.push(newProgress)
    } else {
      this.addToExistingProgress(newProgress, index)
    }
  }
  CombinedUserCourseProgress.prototype.groupIndex = function (part) {
    for (var i = 0; i < this.progress.length; i++) {
      if (this.progress[i].group == part) return i
    }
    return -1
  }
  CombinedUserCourseProgress.prototype.addToExistingProgress = function (
    progress,
    index,
  ) {
    this.progress[index].max_points += progress.max_points
    this.progress[index].n_points += progress.n_points
    this.progress[index].progress =
      this.progress[index].n_points / this.progress[index].max_points
  }
  return CombinedUserCourseProgress
})()
//# sourceMappingURL=generateUserCourseProgress.js.map
