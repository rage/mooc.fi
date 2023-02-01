import { KafkaError } from "../lib/errors"
import sentryLogger from "../lib/logger"
import { createKafkaConsumer } from "./kafkaConsumer/common/createKafkaConsumer"

const logger = sentryLogger({
  service: "kafka-status",
})
const consumer = createKafkaConsumer({ logger })

consumer.connect()

consumer.on("ready", () => {
  setInterval(logStatus, 60000)
})

function logStatus() {
  consumer.getMetadata(undefined, (err, metadata) => {
    if (err) {
      logger.info("Could not get metadata,", { error: err })
      return
    }
    logger.info("Got metadata", { metadata: JSON.stringify(metadata) })
    metadata.topics.forEach((topic) => {
      topic.partitions.forEach((partition) => {
        consumer.queryWatermarkOffsets(
          topic.name,
          partition.id,
          5000,
          (err, offsets) => {
            if (err) {
              logger.info(
                `Could not get offsets for topic ${topic.name} partition ${partition.id}`,
              )
              return
            }
            logger.info(
              `Got topic ${topic.name} partition ${partition.id} offsets`,
              { offsets: JSON.stringify(offsets) },
            )
          },
        )
      })
    })
  })
}

consumer.on("event.error", (error) => {
  logger.error(new KafkaError("Error", error))
  process.exit(-1)
})

consumer.on("event.log", function (log) {
  console.log(log)
})
