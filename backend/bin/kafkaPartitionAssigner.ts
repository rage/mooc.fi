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
  topicPartitionStats: { [key in string]: Array<Partition> }
  topicMedianConsumerLag: { [key in string]: number }
  private recommendedPartitions: { [key in string]: Array<number> }
  private topicCounter: { [key in string]: number }
  private logger: winston.Logger

  constructor(logger: winston.Logger) {
    this.logger = logger
    this.topicPartitionStats = {}
    this.topicMedianConsumerLag = {}
    this.recommendedPartitions = {}
    this.topicCounter = {}

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

    const { topics } = message

    if (!topics) {
      return
    }

    for (const topic in topics) {
      const { partitions } = topics[topic]
      const newTopicPartitions: Array<Partition> = []

      for (const partition in partitions) {
        if (Number(partition) < 0) {
          continue
        }
        newTopicPartitions.push(partitions[partition])
      }
      this.topicPartitionStats[topic] = newTopicPartitions
      this.topicMedianConsumerLag[topic] = median(
        newTopicPartitions
          .map((p) => p.consumer_lag ?? -1)
          .filter((n) => n >= 0),
      )
    }
    this.logConsumerLag()
    this.calculateRecommendedPartitions()
  }

  private logConsumerLag() {
    for (const topic in this.topicPartitionStats) {
      const partitions = this.topicPartitionStats[topic]
      const consumerLag = partitions.map((p) => p.consumer_lag ?? -1)
      this.logger.info(
        `Consumer lag for partitions in topic ${topic} is ${consumerLag} (median: ${this.topicMedianConsumerLag[topic]})`,
      )
    }
  }

  private calculateRecommendedPartitions() {
    for (const topic in this.topicMedianConsumerLag) {
      const medianConsumerLag =
        this.topicMedianConsumerLag[topic] ?? Number.MAX_SAFE_INTEGER
      const partitions = this.topicPartitionStats[topic] ?? []
      const recommendedPartitions: Array<number> = []

      for (const partition of partitions) {
        if (partition.consumer_lag <= medianConsumerLag) {
          recommendedPartitions.push(partition.partition)
        }
      }
      if (recommendedPartitions.length === 0) {
        if (partitions.length > 1) {
          this.logger.warn(
            `No recommended partitions for topic ${topic} (median consumer lag: ${medianConsumerLag})`,
          )
        }
        recommendedPartitions.push(...partitions.map((p) => p.partition))
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
