"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
require("sharp") // image library sharp seems to crash without this require
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
var PRODUCTION = process.env.NODE_ENV === "production"
var nexus_1 = require("nexus")
var nexus_plugin_prisma_1 = require("nexus-plugin-prisma")
var knex_1 = tslib_1.__importDefault(require("./services/knex"))
var redis_1 = tslib_1.__importStar(require("./services/redis"))
var wsServer_1 = require("./wsServer")
var winston = tslib_1.__importStar(require("winston"))
var client_1 = require("nexus-plugin-prisma/client")
var cors_1 = tslib_1.__importDefault(require("cors"))
var morgan_1 = tslib_1.__importDefault(require("morgan"))
var cache_1 = tslib_1.__importDefault(require("./middlewares/cache"))
var auth_plugin_1 = require("./middlewares/auth-plugin")
var newrelic_plugin_1 = require("./middlewares/newrelic-plugin")
var sentry_1 = tslib_1.__importDefault(require("./middlewares/sentry"))
var tmc_1 = tslib_1.__importDefault(require("./services/tmc"))
if (PRODUCTION && !process.env.NEXUS_REFLECTION) {
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    require("newrelic")
  } else {
    console.log("New Relic license key missing")
  }
}
var JSONStream = require("JSONStream")
var prismaClient = new client_1.PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
})
/*prismaClient.on("query", (e) => {
  e.timestamp
  e.query
  e.params
  e.duration
  e.target
  console.log(e)
})*/
nexus_1.use(
  nexus_plugin_prisma_1.prisma({
    client: { instance: prismaClient },
    migrations: false,
    paginationStrategy: "prisma",
    features: { crud: true },
  }),
)
/*nexusSchemaPrisma({
  outputs: {
    typegen: path.join(
      __dirname,
      "./node_modules/@types/nexus-typegen/index.d.ts",
    ),
  },
})*/
var logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "backend" },
  transports: [new winston.transports.Console()],
})
nexus_1.schema.addToContext(function (_a) {
  var req = _a.req
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_b) {
      return [
        2 /*return*/,
        tslib_1.__assign(tslib_1.__assign({}, req), {
          // user: undefined,
          // organization: undefined,
          // role: Role.VISITOR,
          // ...(await contextUser(req, prismaClient)),
          disableRelations: false,
          // userDetails: undefined,
          tmcClient: undefined,
        }),
      ]
    })
  })
})
nexus_1.schema.middleware(sentry_1["default"])
nexus_1.schema.middleware(cache_1["default"])
nexus_1.use(
  auth_plugin_1.moocfiAuthPlugin({
    prisma: prismaClient,
    redisClient: redis_1["default"],
  }),
)
if (
  PRODUCTION &&
  !process.env.NEXUS_REFLECTION &&
  process.env.NEW_RELIC_LICENSE_KEY
) {
  nexus_1.use(newrelic_plugin_1.newrelicPlugin())
}
nexus_1.settings.change({
  logger: {
    pretty: true,
    filter: {
      level: "debug",
    },
  },
  server: {
    port: 4000,
    path: PRODUCTION ? "/api" : "/",
    graphql: {
      introspection: true,
    },
    playground: {
      enabled: true,
    },
  },
  schema: {
    generateGraphQLSDLFile: "./generated/schema.graphql",
    // rootTypingsGlobPattern: "./graphql/**/*.ts",
    connections: {
      default: {
        includeNodesField: true,
      },
    },
    authorization: {},
  },
})
nexus_1.schema.middleware(function (_config) {
  return function (root, args, ctx, info, next) {
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
      var _a
      return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            // only log root level query/mutation, not fields queried
            if (
              !((_a = info.path) === null || _a === void 0 ? void 0 : _a.prev)
            ) {
              logger.info(
                info.operation.operation +
                  ": " +
                  info.path.key +
                  ", args: " +
                  JSON.stringify(args),
              )
            }
            return [
              4 /*yield*/,
              next(root, args, ctx, info),
              /*try {
                      const result = await next(root, args, ctx, info)
                  
                      return result
                    } catch (e) {
                      logger.error(
                        `error: ${e}\n  in type ${config?.parentTypeConfig?.name}, field ${config?.fieldConfig?.name} with args ${config?.args}`,
                      )
                    }*/
            ]
          case 1:
            return [
              2 /*return*/,
              _b.sent(),
              /*try {
                  const result = await next(root, args, ctx, info)
              
                  return result
                } catch (e) {
                  logger.error(
                    `error: ${e}\n  in type ${config?.parentTypeConfig?.name}, field ${config?.fieldConfig?.name} with args ${config?.args}`,
                  )
                }*/
            ]
        }
      })
    })
  }
})
nexus_1.server.express.use(cors_1["default"]())
nexus_1.server.express.use(morgan_1["default"]("combined"))
/*server.express.use(
  graphqlUploadExpress({
    maxFileSize: 10_000_000,
  }),
)*/
nexus_1.server.express.get("/api/completions/:course", function (req, res) {
  var _a
  return tslib_1.__awaiter(this, void 0, void 0, function () {
    var rawToken, secret, course_id, org, course, course_alias, sql, stream
    return tslib_1.__generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          rawToken = req.get("Authorization")
          secret =
            (_a =
              rawToken === null || rawToken === void 0
                ? void 0
                : rawToken.split(" ")[1]) !== null && _a !== void 0
              ? _a
              : ""
          return [
            4 /*yield*/,
            knex_1["default"]
              .select("*")
              .from("organization")
              .where({ secret_key: secret })
              .limit(1),
          ]
        case 1:
          org = _b.sent()[0]
          if (!org) {
            return [
              2 /*return*/,
              res.status(401).json({ message: "Access denied." }),
            ]
          }
          return [
            4 /*yield*/,
            knex_1["default"]
              .select("id")
              .from("course")
              .where({ slug: req.params.course })
              .limit(1),
          ]
        case 2:
          course = _b.sent()[0]
          if (!!course) return [3 /*break*/, 4]
          return [
            4 /*yield*/,
            knex_1["default"]
              .select("course_id")
              .from("course_alias")
              .where({ course_code: req.params.course }),
          ]
        case 3:
          course_alias = _b.sent()[0]
          if (!course_alias) {
            return [
              2 /*return*/,
              res.status(404).json({ message: "Course not found" }),
            ]
          }
          course_id = course_alias.course_id
          return [3 /*break*/, 5]
        case 4:
          course_id = course.id
          _b.label = 5
        case 5:
          sql = knex_1["default"].select("*").from("completion").where({
            course_id: course_id,
            eligible_for_ects: true,
          })
          res.set("Content-Type", "application/json")
          stream = sql.stream().pipe(JSONStream.stringify()).pipe(res)
          req.on("close", stream.end.bind(stream))
          return [2 /*return*/]
      }
    })
  })
})
nexus_1.server.express.get(
  "/api/usercoursesettingscount/:course/:language",
  function (req, res) {
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
      var _a, course, language, resObject
      return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            ;(_a = req.params), (course = _a.course), (language = _a.language)
            if (!course || !language) {
              return [
                2 /*return*/,
                res
                  .status(400)
                  .json({ message: "Course and/or language not specified" }),
              ]
            }
            return [
              4 /*yield*/,
              redis_1.redisify(
                function () {
                  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    var course_id, id, courseAlias, count, factor
                    var _a, _b
                    return tslib_1.__generator(this, function (_c) {
                      switch (_c.label) {
                        case 0:
                          return [
                            4 /*yield*/,
                            knex_1["default"]
                              .select("course.id")
                              .from("course")
                              .join("user_course_settings_visibility", {
                                "course.id":
                                  "user_course_settings_visibility.course_id",
                              })
                              .where({
                                slug: course,
                                "user_course_settings_visibility.language": language,
                              })
                              .limit(1),
                          ]
                        case 1:
                          id = ((_a = _c.sent()[0]) !== null && _a !== void 0
                            ? _a
                            : {}
                          ).id
                          console.log("id", id)
                          if (!!id) return [3 /*break*/, 3]
                          return [
                            4 /*yield*/,
                            knex_1["default"]
                              .select("course_alias.course_id")
                              .from("course_alias")
                              .join("course", {
                                "course_alias.course_id": "course.id",
                              })
                              .join("user_course_settings_visibility", {
                                "course.id":
                                  "user_course_settings_visibility.course_id",
                              })
                              .where({
                                course_code: course,
                                "user_course_settings_visibility.language": language,
                              }),
                          ]
                        case 2:
                          courseAlias = _c.sent()[0]
                          course_id =
                            courseAlias === null || courseAlias === void 0
                              ? void 0
                              : courseAlias.course_id
                          return [3 /*break*/, 4]
                        case 3:
                          course_id = id
                          _c.label = 4
                        case 4:
                          if (!course_id) {
                            return [
                              2 /*return*/,
                              {
                                course: course,
                                language: language,
                                error: true,
                              },
                            ]
                          }
                          return [
                            4 /*yield*/,
                            knex_1["default"]
                              .countDistinct("id as count")
                              .from("user_course_setting")
                              .where({
                                course_id: course_id,
                                language: language,
                              }),
                          ]
                        case 5:
                          count = ((_b = _c.sent()) === null || _b === void 0
                            ? void 0
                            : _b[0]
                          ).count
                          if (count < 100) {
                            count = -1
                          } else {
                            factor = 100
                            count = Math.floor(Number(count) / factor) * factor
                          }
                          return [
                            2 /*return*/,
                            {
                              course: course,
                              language: language,
                              count: Number(count),
                            },
                          ]
                      }
                    })
                  })
                },
                {
                  prefix: "usercoursesettingscount",
                  expireTime: 3600000,
                  key: course + "-" + language,
                },
              ),
            ]
          case 1:
            resObject = _b.sent()
            if (resObject.error) {
              return [
                2 /*return*/,
                res.status(403).json({
                  message: "Course not found or user count not set to visible",
                }),
              ]
            }
            res.json(resObject)
            return [2 /*return*/]
        }
      })
    })
  },
)
nexus_1.server.express.get("/api/progress/:id", function (req, res) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var rawToken, id, details, client_2, e_1, completions, resObject
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          rawToken = req.get("Authorization")
          if (
            !rawToken ||
            !(rawToken !== null && rawToken !== void 0
              ? rawToken
              : ""
            ).startsWith("Bearer")
          ) {
            return [
              2 /*return*/,
              res.status(400).json({ message: "not logged in" }),
            ]
          }
          id = req.params.id
          if (!id) {
            return [
              2 /*return*/,
              res.status(400).json({ message: "must provide id " }),
            ]
          }
          details = null
          _a.label = 1
        case 1:
          _a.trys.push([1, 3, , 4])
          client_2 = new tmc_1["default"](rawToken)
          return [
            4 /*yield*/,
            redis_1.redisify(
              function () {
                return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                  return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4 /*yield*/, client_2.getCurrentUserDetails()]
                      case 1:
                        return [2 /*return*/, _a.sent()]
                    }
                  })
                })
              },
              {
                prefix: "userdetails",
                expireTime: 3600,
                key: rawToken,
              },
            ),
          ]
        case 2:
          details = _a.sent()
          return [3 /*break*/, 4]
        case 3:
          e_1 = _a.sent()
          console.log("error", e_1)
          return [3 /*break*/, 4]
        case 4:
          if (!details) {
            return [
              2 /*return*/,
              res.status(400).json({ message: "invalid credentials" }),
            ]
          }
          return [
            4 /*yield*/,
            knex_1["default"]
              .select(
                "exercise_id",
                "n_points",
                "part",
                "section",
                "max_points",
                "completed",
                "custom_id as quizzes_id",
              )
              .from("exercise_completion")
              .join("exercise", {
                "exercise_completion.exercise_id": "exercise.id",
              })
              .where("exercise.custom_id", id),
          ]
        case 5:
          completions = _a.sent()
          resObject = (completions !== null && completions !== void 0
            ? completions
            : []
          ).reduce(function (acc, curr) {
            var _a
            return tslib_1.__assign(
              tslib_1.__assign({}, acc),
              ((_a = {}),
              (_a[curr.exercise_id] = tslib_1.__assign({}, curr)),
              _a),
            )
          }, {})
          res.json({
            data: resObject,
          })
          return [2 /*return*/]
      }
    })
  })
})
if (!process.env.NEXUS_REFLECTION) {
  // only runtime
  wsServer_1.wsListen()
}
//# sourceMappingURL=app.js.map
