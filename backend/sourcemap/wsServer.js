"use strict"
var _a, _b
exports.__esModule = true
exports.pushMessageToClient = exports.MessageType = exports.wsListen = void 0
var tslib_1 = require("tslib")
var http_1 = require("http")
var WebSocketServer = tslib_1.__importStar(require("websocket"))
var redis_1 = tslib_1.__importStar(require("./services/redis")),
  redis = redis_1
var tmc_1 = require("./services/tmc")
var webSocketsServerPort = 9000
var server = http_1.createServer()
exports.wsListen = function () {
  return server.listen(webSocketsServerPort)
}
var wsServer = new WebSocketServer.server({
  httpServer: server,
})
var connectionByUserCourse = new Map()
var userCourseByConnection = new Map()
var MessageType
;(function (MessageType) {
  MessageType["PROGRESS_UPDATED"] = "PROGRESS_UPDATED"
  MessageType["PEER_REVIEW_RECEIVED"] = "PEER_REVIEW_RECEIVED"
  MessageType["QUIZ_CONFIRMED"] = "QUIZ_CONFIRMED"
  MessageType["QUIZ_REJECTED"] = "QUIZ_REJECTED"
  MessageType["COURSE_CONFIRMED"] = "COURSE_CONFIRMED"
})((MessageType = exports.MessageType || (exports.MessageType = {})))
exports.pushMessageToClient = function (userId, courseId, type, payload) {
  var _a, _b
  var userCourseObjectString = JSON.stringify({
    userId: userId,
    courseId: courseId,
  })
  var connection = connectionByUserCourse.get(userCourseObjectString)
  if (connection) {
    if (connection.connected) {
      connection.sendUTF(
        JSON.stringify({
          type: type,
          message: payload,
        }),
      )
    } else {
      connectionByUserCourse["delete"](userCourseObjectString)
      ;(_a = redis.publisher) === null || _a === void 0
        ? void 0
        : _a.publish(
            "websocket",
            JSON.stringify({
              userId: userId,
              courseId: courseId,
              type: type,
              message: payload,
            }),
          )
    }
  } else {
    ;(_b = redis.publisher) === null || _b === void 0
      ? void 0
      : _b.publish(
          "websocket",
          JSON.stringify({
            userId: userId,
            courseId: courseId,
            type: type,
            message: payload,
          }),
        )
  }
}
wsServer.on("request", function (request) {
  console.log("request ", request.origin)
  var connection = request.accept("echo-protocol", request.origin)
  connection.on("message", function (message) {
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
      var data, accessToken, courseId, user, _a, _b, userCourseObject, error_1
      var _c
      return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            data = JSON.parse(message.utf8Data)
            if (!(data instanceof Object && data.accessToken && data.courseId))
              return [3 /*break*/, 7]
            accessToken = data.accessToken
            courseId = data.courseId
            _d.label = 1
          case 1:
            _d.trys.push([1, 5, , 6])
            _b = (_a = JSON).parse
            return [4 /*yield*/, redis.getAsync(accessToken)]
          case 2:
            user = _b.apply(_a, [
              (_c = _d.sent()) !== null && _c !== void 0 ? _c : "",
            ])
            if (!!user) return [3 /*break*/, 4]
            return [4 /*yield*/, tmc_1.getCurrentUserDetails(accessToken)]
          case 3:
            user = _d.sent()
            redis_1["default"] === null || redis_1["default"] === void 0
              ? void 0
              : redis_1["default"].set(
                  accessToken,
                  JSON.stringify(user),
                  "EX",
                  3600,
                )
            _d.label = 4
          case 4:
            userCourseObject = {
              userId: user.id,
              courseId: courseId,
            }
            connectionByUserCourse.set(
              JSON.stringify(userCourseObject),
              connection,
            )
            userCourseByConnection.set(connection, userCourseObject)
            console.log("connection verified")
            return [3 /*break*/, 6]
          case 5:
            error_1 = _d.sent()
            connection.drop()
            console.log("connection rejected")
            return [3 /*break*/, 6]
          case 6:
            return [3 /*break*/, 8]
          case 7:
            connection.drop()
            _d.label = 8
          case 8:
            return [2 /*return*/]
        }
      })
    })
  })
  connection.on("close", function () {
    var userCourseObjectString = JSON.stringify(
      userCourseByConnection.get(connection),
    )
    userCourseByConnection["delete"](connection)
    connectionByUserCourse["delete"](userCourseObjectString)
  })
})
;(_a = redis.subscriber) === null || _a === void 0
  ? void 0
  : _a.on("message", function (_channel, message) {
      var data = JSON.parse(message)
      if (data instanceof Object && data.userId && data.courseId && data.type) {
        var userId = data.userId
        var courseId = data.courseId
        var userCourseObjectString = JSON.stringify({
          userId: userId,
          courseId: courseId,
        })
        var connection = connectionByUserCourse.get(userCourseObjectString)
        if (connection) {
          if (connection.connected) {
            connection.sendUTF(
              JSON.stringify({
                type: data.type,
                message: data.message,
              }),
            )
          } else {
            connectionByUserCourse["delete"](userCourseObjectString)
          }
        }
      }
    })
;(_b = redis.subscriber) === null || _b === void 0
  ? void 0
  : _b.subscribe("websocket")
//# sourceMappingURL=wsServer.js.map
