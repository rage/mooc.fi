import * as Kafka from "node-rdkafka"
import * as winston from "winston"

import { KAFKA_HOST } from "../config"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "kafka-producer" },
  transports: [new winston.transports.Console()],
})

let producer: Kafka.Producer
let queue: ProducerMessage[] = []
let disconnect: boolean

export default class KafkaProducer {
  constructor() {
    queue = []
    disconnect = false
    producer = new Kafka.Producer({
      "metadata.broker.list": KAFKA_HOST,
      dr_cb: true,
    })
    producer.connect()
    producer.on("ready", async () => await this.producerReadyFunction())
    producer.on("event.error", function (err) {
      logger.error("Error from producer: " + err)
    })
  }

  async disconnect() {
    disconnect = true
  }
  async queueProducerMessage(message: ProducerMessage) {
    if (disconnect) return
    queue.push(message)
  }

  private async producerReadyFunction() {
    while (true) {
      if (disconnect && queue.length < 1) break
      if (queue.length > 0) {
        const message: ProducerMessage = queue.pop() as ProducerMessage

        try {
          producer.produce(
            message.topic,
            message.partition,
            Buffer.from(message.message),
            null,
            Date.now(),
          )
        } catch (err) {
          logger.error("A problem occurred when sending our message: " + err)
        }
      }
    }
    producer.disconnect()
  }
}

export interface ProducerMessage {
  message: string
  topic: string
  partition: number | null
}
