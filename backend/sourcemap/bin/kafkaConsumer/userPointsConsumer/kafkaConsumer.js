"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
var await_semaphore_1 = require("../../lib/await-semaphore")
var Kafka = tslib_1.__importStar(require("node-rdkafka"))
var kafkaConfig_1 = tslib_1.__importDefault(require("../kafkaConfig"))
var handleMessage_1 = require("../common/handleMessage")
var validate_1 = require("./validate")
var saveToDB_1 = require("./saveToDB")
var prisma_1 = tslib_1.__importDefault(require("../../lib/prisma"))
var logger_1 = tslib_1.__importDefault(require("../../lib/logger"))
var TOPIC_NAME = [kafkaConfig_1["default"].user_points_consumer.topic_name]
var mutex = new await_semaphore_1.Mutex()
var prisma = prisma_1["default"]()
var logger = logger_1["default"]({ service: "kafka-consumer-user-points" })
var logCommit = function (err, topicPartitions) {
  if (err) {
    logger.error("Error in commit:" + err)
  } else {
    logger.info("Committed. topicPartitions:" + topicPartitions)
  }
}
var consumer = new Kafka.KafkaConsumer(
  {
    "group.id": "kafka",
    "metadata.broker.list": process.env.KAFKA_HOST,
    offset_commit_cb: logCommit,
    "enable.auto.commit": false,
    "partition.assignment.strategy": "roundrobin",
  },
  { "auto.offset.reset": "earliest" },
)
consumer.connect()
consumer.on("ready", function () {
  consumer.subscribe(TOPIC_NAME)
  var consumerImpl = function (error, messages) {
    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
      return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (error) {
              logger.error("Error while consuming", error)
              process.exit(-1)
            }
            if (!(messages.length > 0)) return [3 /*break*/, 2]
            return [
              4 /*yield*/,
              handleMessage_1.handleMessage({
                kafkaMessage: messages[0],
                mutex: mutex,
                logger: logger,
                consumer: consumer,
                prisma: prisma,
                MessageYupSchema: validate_1.MessageYupSchema,
                saveToDatabase: saveToDB_1.saveToDatabase,
              }),
            ]
          case 1:
            _a.sent()
            setImmediate(function () {
              consumer.consume(1, consumerImpl)
            })
            return [3 /*break*/, 3]
          case 2:
            setTimeout(function () {
              consumer.consume(1, consumerImpl)
            }, 10)
            _a.label = 3
          case 3:
            return [2 /*return*/]
        }
      })
    })
  }
  consumer.consume(1, consumerImpl)
})
consumer.on("event.error", function (error) {
  logger.error(error)
  process.exit(-1)
})
consumer.on("event.log", function (log) {
  console.log(log)
})
//# sourceMappingURL=kafkaConsumer.js.map
