import {
  KAFKA_BRIDGE_SECRET,
  KAFKA_BRIDGE_SERVER_HOST,
  KAFKA_BRIDGE_SERVER_PORT,
  KAFKA_HOST,
} from "../config"
import { KafkaError } from "./lib/errors"
import sentryLogger from "./lib/logger"
import compression from "compression"
// import * as winston from "winston"
import express from "express"
import morgan from "morgan"
import * as Kafka from "node-rdkafka"
import { promisify } from "util"

const logger = sentryLogger({ service: "kafka-bridge" })

if (!KAFKA_BRIDGE_SECRET) {
  console.error("No secret defined in KAFKA_BRIDGE_SECRET, exiting.")
  process.exit(-1)
}

const producer = new Kafka.Producer({
  "client.id": "kafka-bridge",
  "metadata.broker.list": KAFKA_HOST,
})

let flushProducer = promisify(producer.flush.bind(producer))

let producerReady = false
producer.on("ready", () => {
  producerReady = true
})

producer.connect(undefined, (err, data) => {
  if (err) {
    logger.error(new KafkaError("Error while connecting producer", err))
    return
  }
  logger.info("Connected to producer", data)
})

producer.setPollInterval(100)

producer.on("delivery-report", function (err, report) {
  if (err) {
    logger.error(new KafkaError("Delivery report error", err))
  }
  logger.info(`Delivery report ${JSON.stringify(report)}`)
})

let app = express()

app.use(compression())
app.use(express.json())
app.use(morgan("combined"))

const port = parseInt(KAFKA_BRIDGE_SERVER_PORT || "3003")
const host = KAFKA_BRIDGE_SERVER_HOST || "0.0.0.0"

app.post("/kafka-bridge/api/v0/event", async (req, res) => {
  if (
    !req.headers.authorization ||
    req?.headers?.authorization?.split(" ")[1] !== KAFKA_BRIDGE_SECRET
  ) {
    return res.status(403).json({ error: "Not authorized" }).send()
  }

  const { topic, payload } = req.body
  if (!topic || !payload) {
    logger.info(
      `Received an event without a topic or without a payload ${JSON.stringify(
        req.body,
      )}`,
    )
    return res.status(400).json({ error: "Topic or payload missing" }).send()
  }
  logger.info(`Producing to topic ${topic} payload ${JSON.stringify(payload)}`)

  try {
    producer.produce(topic, null, Buffer.from(JSON.stringify(payload)))
    flushProducer(1000)
  } catch (e: any) {
    logger.error(new KafkaError("Producing to kafka failed", e))
    return res.status(500).json({ error: e.toString() }).send()
  }
  res.json({ msg: "Thanks!" }).send()
})
app.get("/kafka-bridge/api/v0/healthz", (_, res) => {
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

app.listen(port, host, () =>
  console.log(`Kafka bridge listening on ${host}:${port}!`),
)
