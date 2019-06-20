require("dotenv-safe").config()
import * as Kafka from "node-rdkafka"

let producer: Kafka.Producer
let queue: ProducerMessage[]
let disconnect: Boolean
export default class KafkaProducer {
  constructor() {
    queue = []
    disconnect = false
    producer = new Kafka.Producer({
      "metadata.broker.list": process.env.KAFKA_HOST,
      dr_cb: true,
    })
    producer.connect()
    producer.on("ready", async () => await this.producerReadyFunction())
    producer.on("event.error", function(err) {
      console.error("Error from producer")
      console.error(err)
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
        const message: ProducerMessage = queue.pop()
        try {
          producer.produce(
            message.topic,
            message.partition,
            Buffer.from(message.message),
            Date.now(),
          )
        } catch (err) {
          console.error("A problem occurred when sending our message")
          console.error(err)
        }
      }
    }
    producer.disconnect()
  }
}

export interface ProducerMessage {
  message: string
  topic: string
  partition: Number | null
}
