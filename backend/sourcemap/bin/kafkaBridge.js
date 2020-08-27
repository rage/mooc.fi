"use strict"
exports.__esModule = true
var tslib_1 = require("tslib")
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
var Kafka = tslib_1.__importStar(require("node-rdkafka"))
// import * as winston from "winston"
var express_1 = tslib_1.__importDefault(require("express"))
var compression_1 = tslib_1.__importDefault(require("compression"))
var body_parser_1 = tslib_1.__importDefault(require("body-parser"))
var morgan_1 = tslib_1.__importDefault(require("morgan"))
var util_1 = require("util")
var SECRET = process.env.KAFKA_BRIDGE_SECRET
if (!SECRET) {
  console.error("No secret defined in KAFKA_BRIDGE_SECRET, exiting.")
  process.exit(-1)
}
/* const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "kafka-consumer-user-points" },
  transports: [new winston.transports.Console()],
})
 */
var producer = new Kafka.Producer({
  "client.id": "kafka-bridge",
  "metadata.broker.list": process.env.KAFKA_HOST,
})
var flushProducer = util_1.promisify(producer.flush.bind(producer))
var producerReady = false
producer.on("ready", function () {
  producerReady = true
})
producer.connect(undefined, function (err, data) {
  if (err) {
    console.error("Error while connecting producer", err)
    return
  }
  console.log("Connected to producer", data)
})
producer.setPollInterval(100)
producer.on("delivery-report", function (err, report) {
  if (err) {
    console.error("Delivery report error", err)
  }
  console.log("Delivery report", report)
})
var app = express_1["default"]()
app.use(compression_1["default"]())
app.use(body_parser_1["default"].json())
app.use(morgan_1["default"]("combined"))
var port = parseInt(process.env.KAFKA_BRIDGE_SERVER_PORT || "3003")
var host = process.env.KAFKA_BRIDGE_SERVER_HOST || "0.0.0.0"
app.post("/kafka-bridge/api/v0/event", function (req, res) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a, topic, payload
    var _b, _c
    return tslib_1.__generator(this, function (_d) {
      if (
        !req.headers.authorization ||
        ((_c =
          (_b = req === null || req === void 0 ? void 0 : req.headers) ===
            null || _b === void 0
            ? void 0
            : _b.authorization) === null || _c === void 0
          ? void 0
          : _c.split(" ")[1]) !== SECRET
      ) {
        return [
          2 /*return*/,
          res.status(403).json({ error: "Not authorized" }).send(),
        ]
      }
      ;(_a = req.body), (topic = _a.topic), (payload = _a.payload)
      if (!topic || !payload) {
        console.log(
          "Received an event without a topic or without a payload",
          req.body,
        )
        return [
          2 /*return*/,
          res.status(400).json({ error: "Topic or payload missing" }).send(),
        ]
      }
      console.log(
        "Producing to topic",
        topic,
        "payload",
        JSON.stringify(payload),
      )
      try {
        producer.produce(topic, null, Buffer.from(JSON.stringify(payload)))
        flushProducer(1000, undefined)
      } catch (e) {
        console.error("Producing to kafka failed", e)
        return [
          2 /*return*/,
          res.status(500).json({ error: e.toString() }).send(),
        ]
      }
      res.json({ msg: "Thanks!" }).send()
      return [2 /*return*/]
    })
  })
})
app.get("/kafka-bridge/api/v0/healthz", function (_, res) {
  if (!producerReady) {
    return res.status(500).json({ error: "Kafka producer not ready" }).send()
  }
  if (!producer.isConnected()) {
    return res
      .status(500)
      .json({ error: "Kafka producer got disconnected" })
      .send()
  }
  res.json({ status: "ok" })
})
app.listen(port, host, function () {
  return console.log("Kafka bridge listening on " + host + ":" + port + "!")
})
// FIXME: (?) not used anywhere
/* const logCommit = (err: any, topicPartitions: any) => {
  if (err) {
    logger.error("Error in commit:" + err)
  } else {
    logger.info("Committed. topicPartitions:" + topicPartitions)
  }
} */
//# sourceMappingURL=kafkaBridge.js.map
