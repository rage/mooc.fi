"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
var Kafka = tslib_1.__importStar(require("node-rdkafka"))
var winston = tslib_1.__importStar(require("winston"))
var logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "kafka-producer" },
  transports: [new winston.transports.Console()],
})
var producer
var queue = []
var disconnect
var KafkaProducer = /** @class */ (function () {
  function KafkaProducer() {
    var _this = this
    queue = []
    disconnect = false
    producer = new Kafka.Producer({
      "metadata.broker.list": process.env.KAFKA_HOST,
      dr_cb: true,
    })
    producer.connect()
    producer.on("ready", function () {
      return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, this.producerReadyFunction()]
            case 1:
              return [2 /*return*/, _a.sent()]
          }
        })
      })
    })
    producer.on("event.error", function (err) {
      logger.error("Error from producer: " + err)
    })
  }
  KafkaProducer.prototype.disconnect = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      return tslib_1.__generator(this, function (_a) {
        disconnect = true
        return [2 /*return*/]
      })
    })
  }
  KafkaProducer.prototype.queueProducerMessage = function (message) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      return tslib_1.__generator(this, function (_a) {
        if (disconnect) return [2 /*return*/]
        queue.push(message)
        return [2 /*return*/]
      })
    })
  }
  KafkaProducer.prototype.producerReadyFunction = function () {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var message
      return tslib_1.__generator(this, function (_a) {
        while (true) {
          if (disconnect && queue.length < 1) break
          if (queue.length > 0) {
            message = queue.pop()
            try {
              producer.produce(
                message.topic,
                message.partition,
                Buffer.from(message.message),
                "", // TODO/FIXME: message key missing?
                Date.now(),
              )
            } catch (err) {
              logger.error(
                "A problem occurred when sending our message: " + err,
              )
            }
          }
        }
        producer.disconnect()
        return [2 /*return*/]
      })
    })
  }
  return KafkaProducer
})()
exports["default"] = KafkaProducer
//# sourceMappingURL=kafkaProducer.js.map
