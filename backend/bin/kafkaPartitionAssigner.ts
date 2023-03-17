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

const DEBUG = false

export class KafkaPartitionAssigner {
  private topicPartitionOffsets: Map<string, Map<number, number>>
  private topicPartitionConsumerLags: Map<string, Map<number, number>>
  private topicMedianConsumerLag: Map<string, number>
  private recommendedPartitions: Map<string, Array<number>>
  private topicCounter: Map<string, number>
  private logger: winston.Logger
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
    this.topicPartitionConsumerLags = new Map()
    this.topicMedianConsumerLag = new Map()
    this.recommendedPartitions = new Map()
    this.topicCounter = new Map()
    this.topicPartitionOffsets = new Map()

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

    if (!this.topicPartitionOffsets.has(topic)) {
      this.topicPartitionOffsets.set(topic, new Map())
    }
    const offsetNumber = Number(offset)
    if (offsetNumber < 0 || Number.isNaN(offsetNumber)) {
      this.topicPartitionOffsets.get(topic)?.delete(partition)

      return
    }

    DEBUG &&
      this.logger.info(
        `DEBUG: Updated topic ${topic} partition ${partition} offset to ${offsetNumber}`,
      )
    this.topicPartitionOffsets.get(topic)?.set(partition, offsetNumber)
  }

  async refreshMetadata() {
    let metadata: Kafka.Metadata

    this.logger.info("Refreshing metadata")
    try {
      metadata = await this.getMetadata({ timeout: 5000 })
    } catch (e: any) {
      this.logger.warn("Could not get metadata from Kafka: " + e.message)
      return
    }

    this.metadata = metadata
  }

  async updateConsumerLag(topicMetadata: Kafka.TopicMetadata) {
    const topic = topicMetadata.name
    const partitions = topicMetadata.partitions.filter((p) => p.id >= 0)

    if (partitions.length < 2) {
      return this.cleanTopic(topic)
    }
    const partitionOffsets = await this.getPartitionOffsets(topic, partitions)

    if (!partitionOffsets) {
      return
    }
    DEBUG &&
      this.logger.info(
        `DEBUG: Partition offsets for ${topic}: ${stringifyMap(
          partitionOffsets,
        )}`,
      )

    const newConsumerLags = new Map<number, number>()

    if (!this.topicPartitionOffsets.has(topic)) {
      this.topicPartitionOffsets.set(topic, new Map())
    }

    for (const [partition, partitionOffset] of partitionOffsets.entries()) {
      if (!this.topicPartitionOffsets.get(topic)?.has(partition)) {
        newConsumerLags.set(partition, -1)
        continue
      }

      const highOffset = Number(partitionOffset.highOffset)
      if (Number.isNaN(highOffset) || highOffset < 0) {
        newConsumerLags.set(partition, -1)

        continue
      }

      const lag =
        highOffset -
        (this.topicPartitionOffsets.get(topic)?.get(partition) ?? 0)
      newConsumerLags.set(partition, lag)
    }
    this.topicPartitionConsumerLags.set(topic, newConsumerLags)

    const positiveLags = Array.from(newConsumerLags.values()).filter(
      (n) => n >= 0,
    )

    if (positiveLags.length === 0) {
      this.cleanTopic(topic)
    } else {
      this.topicMedianConsumerLag.set(topic, median(positiveLags))
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
      await this.updateConsumerLag(topicMetadata)
    }
    this.logConsumerLag()
    this.calculateRecommendedPartitions()
  }

  getRecommendedPartition(topic: string) {
    const recommendedPartitions = this.recommendedPartitions.get(topic) ?? []
    if (recommendedPartitions.length === 0) {
      return null
    }
    this.checkTopicCounter(topic)

    const idx = this.topicCounter.get(topic) ?? 0
    const partition = recommendedPartitions[idx % recommendedPartitions.length]
    this.topicCounter.set(topic, idx + 1)

    return partition
  }

  private async getPartitionOffsets(
    topic: string,
    partitions: Array<Kafka.PartitionMetadata>,
  ): Promise<
    Map<Kafka.PartitionMetadata["id"], Kafka.WatermarkOffsets> | undefined
  > {
    let partitionOffsets: Array<Kafka.WatermarkOffsets>

    try {
      partitionOffsets = await Promise.all(
        partitions.map((p) =>
          this.queryWatermarkOffsets(topic, p.id, 5000).catch(
            () => ({} as Kafka.WatermarkOffsets),
          ),
        ),
      )
    } catch (e: any) {
      this.logger.warn(
        `Could not get partition offsets for ${topic} from Kafka: ` + e.message,
      )
      return
    }

    return new Map(
      partitionOffsets.map((offset, idx) => [partitions[idx].id, offset]),
    )
  }

  private logConsumerLag() {
    for (const topic in this.topicPartitionConsumerLags) {
      const lag = this.topicPartitionConsumerLags.get(topic)
      const medianLag = this.topicMedianConsumerLag.get(topic)
      if (!lag) {
        continue
      }
      if (lag.size > 1) {
        this.logger.info(
          `Consumer lag for partitions in topic ${topic} is ${stringifyMap(
            lag,
          )} (median: ${medianLag})`,
        )
      }
    }
  }

  private calculateRecommendedPartitions() {
    for (const topic in this.topicMedianConsumerLag.keys()) {
      const medianConsumerLag = this.topicMedianConsumerLag.get(topic)
      const partitionLag = this.topicPartitionConsumerLags.get(topic)
      if (!medianConsumerLag || !partitionLag) {
        this.recommendedPartitions.set(topic, [])

        continue
      }
      const recommendedPartitions: Array<number> = []

      for (const [partition, lag] of partitionLag.entries()) {
        if (lag < medianConsumerLag) {
          recommendedPartitions.push(Number(partition))
        }
      }
      if (recommendedPartitions.length === 0) {
        if (partitionLag.size > 1) {
          this.logger.warn(
            `No recommended partitions for topic ${topic} (${partitionLag.size} partitions, median consumer lag: ${medianConsumerLag})`,
          )
        }
      }
      this.recommendedPartitions.set(topic, recommendedPartitions)
      this.checkTopicCounter(topic)
    }
  }

  private checkTopicCounter(topic: string) {
    if (
      !this.topicCounter.has(topic) ||
      (this.topicCounter.get(topic) ?? 0) >= Number.MAX_SAFE_INTEGER / 2
    ) {
      this.topicCounter.set(topic, 0)
    }
  }

  private cleanTopic(topic: string) {
    this.topicMedianConsumerLag.delete(topic)
    this.recommendedPartitions.delete(topic)
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

function stringifyMap<K, V>(map: Map<K, V>) {
  return JSON.stringify(map, replacer)
}

function replacer<K, V>(_key: K, value: V) {
  if (value instanceof Map) {
    return Object.fromEntries(value.entries())
  } else {
    return value
  }
}
