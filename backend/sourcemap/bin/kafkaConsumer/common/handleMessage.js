"use strict"
exports.__esModule = true
exports.handleMessage = void 0
var tslib_1 = require("tslib")
var kafkaConfig_1 = tslib_1.__importDefault(require("../kafkaConfig"))
var commitCounter = 0
var commitInterval = kafkaConfig_1["default"].commit_interval
exports.handleMessage = function (_a) {
  var kafkaMessage = _a.kafkaMessage,
    mutex = _a.mutex,
    logger = _a.logger,
    consumer = _a.consumer,
    prisma = _a.prisma,
    MessageYupSchema = _a.MessageYupSchema,
    saveToDatabase = _a.saveToDatabase
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var release, message, e_1, error_1, error_2
    var _b, _c
    return tslib_1.__generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          return [4 /*yield*/, mutex.acquire()]
        case 1:
          release = _d.sent()
          logger.info("Handling a message.")
          _d.label = 2
        case 2:
          _d.trys.push([2, 3, , 5])
          message = JSON.parse(
            (_c =
              (_b =
                kafkaMessage === null || kafkaMessage === void 0
                  ? void 0
                  : kafkaMessage.value) === null || _b === void 0
                ? void 0
                : _b.toString("utf8")) !== null && _c !== void 0
              ? _c
              : "",
          )
          return [3 /*break*/, 5]
        case 3:
          e_1 = _d.sent()
          logger.error("invalid message", e_1)
          return [4 /*yield*/, commit(kafkaMessage, consumer)]
        case 4:
          _d.sent()
          release()
          return [2 /*return*/]
        case 5:
          _d.trys.push([5, 7, , 9])
          return [4 /*yield*/, MessageYupSchema.validate(message)]
        case 6:
          _d.sent()
          return [3 /*break*/, 9]
        case 7:
          error_1 = _d.sent()
          logger.error("JSON VALIDATE FAILED: " + error_1, {
            message: JSON.stringify(message),
          })
          return [4 /*yield*/, commit(kafkaMessage, consumer)]
        case 8:
          _d.sent()
          release()
          return [2 /*return*/]
        case 9:
          _d.trys.push([9, 11, , 12])
          logger.info("Saving. Timestamp " + message.timestamp)
          return [4 /*yield*/, saveToDatabase(message, prisma, logger)]
        case 10:
          if (!_d.sent()) {
            logger.error("Could not save event to database")
          }
          return [3 /*break*/, 12]
        case 11:
          error_2 = _d.sent()
          logger.error("Could not save event to database:", error_2)
          return [3 /*break*/, 12]
        case 12:
          return [
            4 /*yield*/,
            commit(kafkaMessage, consumer),
            //Releasing mutex
          ]
        case 13:
          _d.sent()
          //Releasing mutex
          release()
          return [2 /*return*/]
      }
    })
  })
}
var commit = function (message, consumer) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!(commitCounter >= commitInterval)) return [3 /*break*/, 2]
          return [4 /*yield*/, consumer.commitMessage(message)]
        case 1:
          _a.sent()
          commitCounter = 0
          _a.label = 2
        case 2:
          commitCounter++
          return [2 /*return*/]
      }
    })
  })
}
//# sourceMappingURL=handleMessage.js.map
