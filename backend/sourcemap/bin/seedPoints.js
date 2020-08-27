"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var faker = tslib_1.__importStar(require("faker"))
var prisma_1 = tslib_1.__importDefault(require("./lib/prisma"))
var prisma = prisma_1["default"]()
//Generate integer id which is not already taken
function generateUniqueUpstreamId(_a) {
  var ExistingIds = _a.ExistingIds
  //take the largest possible integer
  var LargestPossibleUpstreamId = 2147483647
  var UniqueIntId = 0
  //Go down from the largest possible integer
  //until value not already in use is found
  var i
  for (i = LargestPossibleUpstreamId; i > 0; i--) {
    if (ExistingIds.indexOf(i) === -1) {
      UniqueIntId = i
      return UniqueIntId
    }
  }
  return UniqueIntId
}
function generateRandomString() {
  var randomString =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  return randomString
}
var addUsers = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var UsersInDatabase, UpstreamIdsInUse, i, first_name, last_name, newUser
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.user.findMany(),
            //create a list of upstream ids already in use
          ]
        case 1:
          UsersInDatabase = _a.sent()
          UpstreamIdsInUse = UsersInDatabase.map(function (user) {
            return user.upstream_id
          })
          i = 0
          _a.label = 2
        case 2:
          if (!(i < 100)) return [3 /*break*/, 4]
          first_name = faker.name.firstName()
          last_name = faker.name.lastName()
          newUser = {
            upstream_id: generateUniqueUpstreamId({
              ExistingIds: UpstreamIdsInUse,
            }),
            first_name: first_name,
            last_name: last_name,
            username: faker.internet.userName(first_name, last_name),
            email: faker.internet.email(first_name, last_name),
            administrator: false,
            student_number: generateRandomString(),
            real_student_number: generateRandomString(),
          }
          //add new upstreamId to ids already in use
          UpstreamIdsInUse = UpstreamIdsInUse.concat(newUser.upstream_id)
          return [4 /*yield*/, prisma.user.create({ data: newUser })]
        case 3:
          _a.sent()
          i += 1
          return [3 /*break*/, 2]
        case 4:
          return [2 /*return*/]
      }
    })
  })
}
var addServices = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var i, newService
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          i = 0
          _a.label = 1
        case 1:
          if (!(i < 5)) return [3 /*break*/, 3]
          newService = {
            url: generateRandomString(),
            name: generateRandomString(),
          }
          return [4 /*yield*/, prisma.service.create({ data: newService })]
        case 2:
          _a.sent()
          i += 1
          return [3 /*break*/, 1]
        case 3:
          return [2 /*return*/]
      }
    })
  })
}
// FIXME: (?) not used anywhere
/* const addUserCourseServiceProgressess = async ({
  courseId,
}: {
  courseId: string
}) => {
  const UsersInDb = await prisma.users({ first: 100 })
  const ServicesInDb = await prisma.services({ first: 5 })
  const AllServiceIds = ServicesInDb.map(s => s.id)
  return await Promise.all(
    UsersInDb.map(async user => {
      const ucsp = {
        user: {
          connect: {
            id: user.id,
          },
        },
        course: {
          connect: {
            id: courseId,
          },
        },
        service: {
          connect: {
            id: AllServiceIds[Math.floor(Math.random() * 5)],
          },
        },
        progress: [
          {
            group: "week1",
            max_points: 10,
            n_points: Math.floor(Math.random() * 10),
            progress: Math.random(),
          },
          {
            group: "week2",
            max_points: 8,
            n_points: Math.floor(Math.random() * 8),
            progress: Math.random(),
          },
          {
            group: "week3",
            max_points: 12,
            n_points: Math.floor(Math.random() * 12),
            progress: Math.random(),
          },
          {
            group: "week4",
            max_points: 20,
            n_points: Math.floor(Math.random() * 20),
            progress: Math.random(),
          },
          {
            group: "week5",
            max_points: 18,
            n_points: Math.floor(Math.random() * 18),
            progress: Math.random(),
          },
        ],
        user_course_progress: {
          create: {
            user: {
              connect: {
                id: user.id,
              },
            },
            course: {
              connect: {
                id: courseId,
              },
            },
            progress: [
              {
                group: "week1",
                max_points: 10,
                n_points: Math.floor(Math.random() * 10),
                progress: Math.random(),
              },
              {
                group: "week2",
                max_points: 8,
                n_points: Math.floor(Math.random() * 8),
                progress: Math.random(),
              },
              {
                group: "week3",
                max_points: 12,
                n_points: Math.floor(Math.random() * 12),
                progress: Math.random(),
              },
              {
                group: "week4",
                max_points: 20,
                n_points: Math.floor(Math.random() * 20),
                progress: Math.random(),
              },
              {
                group: "week5",
                max_points: 18,
                n_points: Math.floor(Math.random() * 18),
                progress: Math.random(),
              },
            ],
          },
        },
      }
      await prisma.createUserCourseServiceProgress(ucsp)
    }),
  )
} */
var addUserCourseProgressess = function (_a) {
  var courseId = _a.courseId
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var UsersInDb
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, prisma.user.findMany({ take: 100 })]
        case 1:
          UsersInDb = _b.sent()
          return [
            4 /*yield*/,
            Promise.all(
              UsersInDb.map(function (user) {
                return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                  var ucp
                  return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        ucp = {
                          user: {
                            connect: {
                              id: user.id,
                            },
                          },
                          course: {
                            connect: {
                              id: courseId,
                            },
                          },
                          progress: [
                            {
                              group: "week1",
                              max_points: 10,
                              n_points: Math.floor(Math.random() * 10),
                              progress: Math.random(),
                            },
                            {
                              group: "week2",
                              max_points: 8,
                              n_points: Math.floor(Math.random() * 8),
                              progress: Math.random(),
                            },
                            {
                              group: "week3",
                              max_points: 12,
                              n_points: Math.floor(Math.random() * 12),
                              progress: Math.random(),
                            },
                            {
                              group: "week4",
                              max_points: 20,
                              n_points: Math.floor(Math.random() * 20),
                              progress: Math.random(),
                            },
                            {
                              group: "week5",
                              max_points: 18,
                              n_points: Math.floor(Math.random() * 18),
                              progress: Math.random(),
                            },
                          ],
                        }
                        return [
                          4 /*yield*/,
                          prisma.userCourseProgress.create({ data: ucp }),
                        ]
                      case 1:
                        return [2 /*return*/, _a.sent()]
                    }
                  })
                })
              }),
            ),
          ]
        case 2:
          return [2 /*return*/, _b.sent()]
      }
    })
  })
}
var addUserCourseSettingses = function (_a) {
  var courseId = _a.courseId
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var UsersInDb
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, prisma.user.findMany({ take: 100 })]
        case 1:
          UsersInDb = _b.sent()
          return [
            4 /*yield*/,
            Promise.all(
              UsersInDb.map(function (user) {
                return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                  var ucs
                  return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        ucs = {
                          user: {
                            connect: {
                              id: user.id,
                            },
                          },
                          course: {
                            connect: {
                              id: courseId,
                            },
                          },
                          language: "fi_FI",
                          country: "Finland",
                          research: true,
                          marketing: false,
                          course_variant: null,
                          other: null,
                        }
                        return [
                          4 /*yield*/,
                          prisma.userCourseSetting.create({ data: ucs }),
                        ]
                      case 1:
                        return [2 /*return*/, _a.sent()]
                    }
                  })
                })
              }),
            ),
          ]
        case 2:
          return [2 /*return*/, _b.sent()]
      }
    })
  })
}
var seedPointsData = function () {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var course, _a, _b
    return tslib_1.__generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.course.findOne({
              where: { slug: "elements-of-ai" },
            }),
          ]
        case 1:
          course = _c.sent()
          console.log("course", course)
          return [4 /*yield*/, addUsers()]
        case 2:
          _c.sent()
          return [4 /*yield*/, addServices()]
        case 3:
          _c.sent()
          _a = course
          if (!_a) return [3 /*break*/, 5]
          return [
            4 /*yield*/,
            addUserCourseProgressess({ courseId: course.id }),
          ]
        case 4:
          _a = _c.sent()
          _c.label = 5
        case 5:
          _a
          _b = course
          if (!_b) return [3 /*break*/, 7]
          return [4 /*yield*/, addUserCourseSettingses({ courseId: course.id })]
        case 6:
          _b = _c.sent()
          _c.label = 7
        case 7:
          _b
          return [2 /*return*/]
      }
    })
  })
}
seedPointsData()
//# sourceMappingURL=seedPoints.js.map
