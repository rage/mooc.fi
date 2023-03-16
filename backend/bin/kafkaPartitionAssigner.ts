import { promisify } from "util"

import * as Kafka from "node-rdkafka"
import * as winston from "winston"

type StatsEventMessage = {
  name: string
  topics: { [key in string]: Topic }
}

type Topic = {
  topic: string
  partitions: { [key in string]: Partition }
}

type Partition = {
  partition: number
  broker: number
  leader: number
  consumer_lag: number
  consumer_lag_stored: number
}

type StatsEvent = {
  message: StatsEventMessage
}

export class KafkaPartitionAssigner {
  private topicPartitionOffsets: {
    [key in string]: { [key in number]: number }
  }
  private topicPartitionConsumerLags: {
    [key in string]: { [key in number]: number }
  }
  private topicMedianConsumerLag: { [key in string]: number }
  private recommendedPartitions: { [key in string]: Array<number> }
  private topicCounter: { [key in string]: number }
  private logger: winston.Logger
  // private producer: Kafka.Producer
  private getMetadata: (
    metadataOptions?: Kafka.MetadataOptions,
  ) => Promise<Kafka.Metadata>
  private queryWatermarkOffsets: (
    topic: string,
    partition: number,
    timeout: number,
  ) => Promise<Kafka.WatermarkOffsets>
  private metadata?: Kafka.Metadata

  constructor(producer: Kafka.Producer, logger: winston.Logger) {
    this.logger = logger
    this.topicPartitionConsumerLags = {}
    this.topicMedianConsumerLag = {}
    this.recommendedPartitions = {}
    this.topicCounter = {}
    this.topicPartitionOffsets = {}

    this.getMetadata = promisify(producer.getMetadata.bind(producer))
    this.queryWatermarkOffsets = promisify(
      producer.queryWatermarkOffsets.bind(producer),
    )
    logger.info("KafkaPartitionAssigner initialized")
  }

  handleEventStatsData(event: StatsEvent) {
    const { message } = event
    if (!message) {
      this.logger.warn("Received stats event but no message")
      return
    }

    this.logger.info(
      `Received internal metrics report: ${JSON.stringify(message)}`,
    )
  }

  updateTopicPartitionOffset(report: Kafka.TopicPartitionOffset) {
    const { topic, offset, partition } = report
    if (!this.topicPartitionOffsets[topic]) {
      this.topicPartitionOffsets[topic] = {}
    }
    const offsetNumber = Number(offset)
    if (offsetNumber < 0 || Number.isNaN(offsetNumber)) {
      delete this.topicPartitionOffsets[topic][partition]

      return
    }

    this.topicPartitionOffsets[topic][partition] = offsetNumber
  }

  async refreshMetadata() {
    let metadata: Kafka.Metadata
    try {
      metadata = await this.getMetadata({ timeout: 5000 })
    } catch (e: any) {
      this.logger.warn("Could not get metadata from Kafka: " + e.message)
      return
    }

    this.metadata = metadata
  }

  async getConsumerLag(topicMetadata: Kafka.TopicMetadata) {
    const topic = topicMetadata.name
    const partitions = topicMetadata.partitions.filter((p) => p.id >= 0)

    let partitionOffsets: Array<Kafka.WatermarkOffsets>

    // this.logger.info("Getting consumer lag for topic " + topic)
    try {
      partitionOffsets = await Promise.all(
        partitions.map((p) =>
          this.queryWatermarkOffsets(topic, p.id, 5000).catch(
            () => ({} as Kafka.WatermarkOffsets),
          ),
        ),
      )
    } catch (e: any) {
      this.logger.info(
        "Could not get partition offsets from Kafka: " + e.message,
      )
      return
    }
    const newConsumerLags: { [key in number]: number } = {}

    if (!this.topicPartitionOffsets[topic]) {
      this.topicPartitionOffsets[topic] = {}
    }
    for (let i = 0; i < partitions.length; i++) {
      const partition = partitions[i]
      const partitionOffset = partitionOffsets[i]
      if (!this.topicPartitionOffsets[topic][partition.id]) {
        newConsumerLags[partition.id] = -1
        continue
      }

      const highOffset = Number(partitionOffset.highOffset)
      if (Number.isNaN(highOffset) || highOffset < 0) {
        newConsumerLags[partition.id] = -1

        continue
      }

      const lag = highOffset - this.topicPartitionOffsets[topic][partition.id]
      newConsumerLags[partition.id] = lag
    }
    this.topicPartitionConsumerLags[topic] = newConsumerLags
    const positiveLags = Object.values(newConsumerLags).filter((n) => n >= 0)
    if (positiveLags.length === 0) {
      this.topicMedianConsumerLag[topic] = -1
    } else {
      this.topicMedianConsumerLag[topic] = median(positiveLags)
    }
  }

  async updateConsumerLags() {
    this.logger.info("Updating consumer lags")
    if (!this.metadata) {
      this.logger.warn("No metadata available")
      return
    }

    for (const topicMetadata of this.metadata.topics) {
      if (topicMetadata.name.startsWith("__")) {
        continue
      }
      await this.getConsumerLag(topicMetadata)
    }
    this.logConsumerLag()
    this.calculateRecommendedPartitions()
  }

  private logConsumerLag() {
    for (const topic in this.topicPartitionConsumerLags) {
      const lag = this.topicPartitionConsumerLags[topic]
      const medianLag = this.topicMedianConsumerLag[topic]
      this.logger.info(
        `Consumer lag for partitions in topic ${topic} is ${JSON.stringify(
          lag,
        )} (median: ${medianLag})`,
      )
    }
  }

  private calculateRecommendedPartitions() {
    for (const topic in this.topicMedianConsumerLag) {
      const medianConsumerLag =
        this.topicMedianConsumerLag[topic] ?? Number.MAX_SAFE_INTEGER
      const partitionLag = this.topicPartitionConsumerLags[topic] ?? {}
      const recommendedPartitions: Array<number> = []

      for (const [partition, lag] of Object.entries(partitionLag)) {
        if (lag >= 0 && lag <= medianConsumerLag) {
          recommendedPartitions.push(Number(partition))
        }
      }
      if (recommendedPartitions.length === 0) {
        if (Object.keys(partitionLag).length > 1) {
          this.logger.warn(
            `No recommended partitions for topic ${topic} (median consumer lag: ${medianConsumerLag})`,
          )
        }
        recommendedPartitions.push(...Object.keys(partitionLag).map(Number))
      }
      this.recommendedPartitions[topic] = recommendedPartitions
      this.topicCounter[topic] = 0
    }
  }

  getRecommendedPartition(topic: string) {
    const recommendedPartitions = this.recommendedPartitions[topic]
    if ((recommendedPartitions ?? []).length === 0) {
      return null
    }
    const partition =
      recommendedPartitions[
        this.topicCounter[topic] % recommendedPartitions.length
      ]
    this.topicCounter[topic]++

    return partition
  }
}

function median(numbers: Array<number>) {
  const sorted = Array.from(numbers).sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}
