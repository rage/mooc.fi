require("dotenv-safe").config()

import * as Kafka from "node-rdkafka"
import * as winston from "winston"
import * as express from "express"
import * as compression from "compression"
import * as bodyParser from "body-parser"
import { promisify } from "util"

const SECRET = process.env.KAFKA_BRIDGE_SECRET

if (!SECRET) {
  console.error("No seceret defined in KAFKA_BRIDGE_SECRET, exiting.")
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
const port = process.env.KAFKA_BRIDGE_PORT || 3003

app.post("/api/v0/event", async (req, res) => {
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
    return res
      .status(400)
      .json({ error: "Topic or payload missing" })
      .send()
  }
  console.log(topic, payload)

  try {
    producer.produce(topic, null, Buffer.from(payload))
    await flushProducer(1000)
  } catch (e) {
    return res
      .status(500)
      .json({ error: e.toString() })
      .send()
  }
  res.json({ msg: "Thanks!" }).send()
})
app.get("/healthz", (_, res) => {
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

app.listen(port, () => console.log(`Kafka bridge listening on port ${port}!`))

// FIXME: (?) not used anywhere
// @ts-ignore
const logCommit = (err: any, topicPartitions: any) => {
  if (err) {
    logger.error("Error in commit:" + err)
  } else {
    logger.info("Committed. topicPartitions:" + topicPartitions)
  }
}
