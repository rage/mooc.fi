"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
var await_semaphore_1 = require("../../lib/await-semaphore")
var Kafka = tslib_1.__importStar(require("node-rdkafka"))
var prisma_1 = tslib_1.__importDefault(require("../../lib/prisma"))
var logger_1 = tslib_1.__importDefault(require("../../lib/logger"))
var handleMessage_1 = require("../common/handleMessage")
var validate_1 = require("./validate")
var saveToDB_1 = require("./saveToDB")
var kafkaConfig_1 = tslib_1.__importDefault(require("../kafkaConfig"))
var TOPIC_NAME = [kafkaConfig_1["default"].exercise_consumer.topic_name]
var mutex = new await_semaphore_1.Mutex()
var prisma = prisma_1["default"]()
var logger = logger_1["default"]({ service: "kafka-consumer-exercise" })
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
consumer
  .on("ready", function () {
    consumer.subscribe(TOPIC_NAME)
    consumer.consume()
  })
  .on("data", function (message) {
    return handleMessage_1.handleMessage({
      kafkaMessage: message,
      mutex: mutex,
      logger: logger,
      consumer: consumer,
      prisma: prisma,
      MessageYupSchema: validate_1.MessageYupSchema,
      saveToDatabase: saveToDB_1.saveToDatabase,
    })
  })
consumer.on("event.error", function (error) {
  logger.error(error)
  throw error
})
consumer.on("event.log", function (log) {
  console.log(log)
})
//# sourceMappingURL=kafkaConsumer.js.map
