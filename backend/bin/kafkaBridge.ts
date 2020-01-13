require("dotenv-safe").config()

import * as Kafka from "node-rdkafka"
import * as winston from "winston"
import * as express from "express"
import * as compression from "compression"
import * as bodyParser from "body-parser"
import * as morgan from "morgan"
import { promisify } from "util"

const SECRET = process.env.KAFKA_BRIDGE_SECRET

if (!SECRET) {
  console.error("No secret defined in KAFKA_BRIDGE_SECRET, exiting.")
  process.exit(-1)
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "kafka-consumer-user-points" },
  transports: [new winston.transports.Console()],
})

const producer = new Kafka.Producer({
  "client.id": "kafka-bridge",
  "metadata.broker.list": process.env.KAFKA_HOST,
})

const flushProducer = promisify(producer.flush.bind(this))

let producerReady = false

producer.on("ready", () => {
  producerReady = true
})

producer.connect(undefined, (err, data) => {
  if (err) {
    console.error("Error while connecting producer", err)
    return
  }
  console.log("Connected to producer", data)
})

let app = express()
app.use(compression())
app.use(bodyParser.json())
app.use(morgan("combined"))
const port = parseInt(process.env.KAFKA_BRIDGE_SERVER_PORT || "3003")
const host = process.env.KAFKA_BRIDGE_SERVER_HOST || "0.0.0.0"

app.post("/kafka-bridge/api/v0/event", async (req, res) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[1] !== SECRET
  ) {
    return res
      .status(403)
      .json({ error: "Not authorized" })
      .send()
  }

  const { topic, payload } = req.body
  if (!topic || !payload) {
    console.log(
      "Received an event without a topic or without a payload",
      req.body,
    )
    return res
      .status(400)
      .json({ error: "Topic or payload missing" })
      .send()
  }
  console.log("Producing to topic", topic, "payload", JSON.stringify(payload))

  try {
    producer.produce(topic, null, Buffer.from(payload))
    await flushProducer(1000)
  } catch (e) {
    console.error("Producing to kafka failed", e)
    return res
      .status(500)
      .json({ error: e.toString() })
      .send()
  }
  res.json({ msg: "Thanks!" }).send()
})
app.get("/kafka-bridge/api/v0/healthz", (_, res) => {
  if (!producerReady) {
    return res
      .status(500)
      .json({ error: "Kafka producer not ready" })
      .send()
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

// FIXME: (?) not used anywhere
// @ts-ignore
const logCommit = (err: any, topicPartitions: any) => {
  if (err) {
    logger.error("Error in commit:" + err)
  } else {
    logger.info("Committed. topicPartitions:" + topicPartitions)
  }
}
