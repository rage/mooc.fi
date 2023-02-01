import { KafkaConsumer } from "node-rdkafka"

import { BaseContext } from "../../../context"
import { Mutex } from "../../../lib/await-semaphore"

export interface KafkaContext extends BaseContext {
  consumer: KafkaConsumer
  mutex: Mutex
  topic_name: string
}
