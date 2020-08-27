"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
var slackPoster_1 = tslib_1.__importDefault(require("../services/slackPoster"))
var knex_1 = tslib_1.__importDefault(require("../services/knex"))
var prisma_1 = tslib_1.__importDefault(require("./lib/prisma"))
var slackPoster = new slackPoster_1["default"]()
var url = process.env.AI_SLACK_URL
if (!url) {
  throw "no AI_SLACK_URL env variable"
}
var data = { text: "" }
var prisma = prisma_1["default"]()
var langArr = [
  {
    language: "se",
    completion_language: "sv_SE",
    country: "Sweden",
    langName: "Swedish",
  },
  {
    language: "fi",
    completion_language: "fi_FI",
    country: "Finland",
    langName: "Finnish",
  },
  {
    language: "ee",
    completion_language: "et_EE",
    country: "Estonia",
    langName: "Estonian",
  },
  {
    language: "de",
    completion_language: "de_DE",
    country: "Germany",
    langName: "German",
  },
  {
    language: "no",
    completion_language: "nb_NO",
    country: "Norway",
    langName: "Norwegian",
  },
  {
    language: "lv",
    completion_language: "lv_LV",
    country: "Latvia",
    langName: "Latvian",
  },
]
var getDataByLanguage = function (langProps) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var totalByLang, completionsByLang, englishInLang, now
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.userCourseSetting.findMany({
              where: {
                language: langProps.language,
                course: { slug: "elements-of-ai" },
              },
            }),
          ]
        case 1:
          totalByLang = _a.sent()
          return [
            4 /*yield*/,
            prisma.completion.findMany({
              where: {
                course: { slug: "elements-of-ai" },
                completion_language: langProps.completion_language,
              },
            }),
          ]
        case 2:
          completionsByLang = _a.sent()
          return [
            4 /*yield*/,
            prisma.userCourseSetting.findMany({
              where: {
                country: langProps.country,
                language: "en",
              },
            }),
          ]
        case 3:
          englishInLang = _a.sent()
          now = new Date()
          return [
            2 /*return*/,
            "```Stats " +
              now.getDate() +
              "." +
              (now.getMonth() + 1) +
              "." +
              now.getFullYear() +
              ":\n\n  1) " +
              totalByLang.length +
              " registered students in the " +
              langProps.langName +
              " version\n  2) of these " +
              completionsByLang.length +
              " have completed the course.\n  3) " +
              englishInLang.length +
              " people registered for the English course residing in " +
              langProps.country +
              ".\n\n  In total: " +
              totalByLang.length +
              " + " +
              englishInLang.length +
              " = " +
              (totalByLang.length + englishInLang.length) +
              "``` ",
          ]
      }
    })
  })
}
// const getGlobalStats = async () => {
//   const totalUsers = await prisma.userCourseSettingses({
//     where: {
//       course: { slug: "elements-of-ai" },
//     },
//   })
//   const totalCompletions = await prisma.completions({
//     where: {
//       course: { slug: "elements-of-ai" },
//     },
//   })
//   const now = new Date()
//   return `\`\`\`Stats ${now.getDate()}.${now.getMonth() +
//     1}.${now.getFullYear()}:
//   1) ${totalUsers.length} registered students in all versions
//   2) of these ${totalCompletions.length} have completed the course.\`\`\` `
// }
var getGlobalStats = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var course, totalUsers, totalCompletions, now
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            knex_1["default"]
              .select("id")
              .from("course")
              .where({ slug: "elements-of-ai" }),
          ]
        case 1:
          course = _a.sent()
          return [
            4 /*yield*/,
            knex_1["default"]
              .count()
              .from("user_course_setting")
              .where({ course_id: course[0].id }),
          ]
        case 2:
          totalUsers = _a.sent()[0].count
          return [
            4 /*yield*/,
            knex_1["default"]
              .count()
              .from("completion")
              .where({ course_id: course[0].id }),
          ]
        case 3:
          totalCompletions = _a.sent()[0].count
          now = new Date()
          return [
            2 /*return*/,
            "```Stats " +
              now.getDate() +
              "." +
              (now.getMonth() + 1) +
              "." +
              now.getFullYear() +
              ":\n    1) " +
              totalUsers +
              " registered students in all versions\n    2) of these " +
              totalCompletions +
              " have completed the course.``` ",
          ]
      }
    })
  })
}
var post = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, i, _d, _e, _f
    return tslib_1.__generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          _a = data
          _c = (_b = data.text).concat
          return [4 /*yield*/, getGlobalStats()]
        case 1:
          _a.text = _c.apply(_b, [_g.sent()])
          i = 0
          _g.label = 2
        case 2:
          if (!(i < langArr.length)) return [3 /*break*/, 5]
          _d = data
          _f = (_e = data.text).concat
          return [4 /*yield*/, getDataByLanguage(langArr[i])]
        case 3:
          _d.text = _f.apply(_e, [_g.sent()])
          _g.label = 4
        case 4:
          i++
          return [3 /*break*/, 2]
        case 5:
          return [4 /*yield*/, slackPoster.post(url, data)]
        case 6:
          _g.sent()
          knex_1["default"].destroy()
          return [2 /*return*/]
      }
    })
  })
}
post().then(function () {
  return process.exit(0)
})
//# sourceMappingURL=sendAiStatistics.js.map
