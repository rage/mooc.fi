import * as winston from "winston"

type EventStatsData = {
  name: string
  topics: { [key in string]: EventStatsTopic }
}

type EventStatsTopic = {
  topic: string
  partitions: { [key in string]: EventStatsPartition }
}

type EventStatsPartition = {
  partition: number
  broker: number
  leader: number
  consumer_lag: number
  consumer_lag_stored: number
}

export class KafkaPartitionAssigner {
  topicPartitionStats: { [key in string]: Array<EventStatsPartition> }
  topicMedianConsumerLag: { [key in string]: number }
  private recommendedPartitions: { [key in string]: Array<number> }
  private topicCounter: { [key in string]: number }

  constructor(private logger: winston.Logger) {
    this.topicPartitionStats = {}
    this.topicMedianConsumerLag = {}
    this.recommendedPartitions = {}
    this.topicCounter = {}
  }

  handleEventStatsData(data: EventStatsData) {
    const { topics } = data

    this.logger.info(
      `Received internal metrics report: ${JSON.stringify(data)}`,
    )

    if (!topics) {
      return
    }

    for (const topic in topics) {
      const { partitions } = topics[topic]
      const newTopicPartitions: Array<EventStatsPartition> = []

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
