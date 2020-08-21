import { PrismaClient } from "@prisma/client"
import { Mutex } from "../../lib/await-semaphore"
import { Logger } from "winston"
import { KafkaConsumer, Message as KafkaMessage } from "node-rdkafka"
import * as yup from "yup"

const config = require("../kafkaConfig.json")

let commitCounter = 0

const commitInterval = config.commit_interval

interface HandleMessageConfig<Message extends { timestamp: string }> {
  kafkaMessage: KafkaMessage
  mutex: Mutex
  logger: Logger
  consumer: KafkaConsumer
  prisma: PrismaClient
  MessageYupSchema: yup.ObjectSchema<any>
  saveToDatabase: (
    message: Message,
    prisma: PrismaClient,
    logger: Logger,
  ) => Promise<any>
}

export const handleMessage = async <Message extends { timestamp: string }>({
  kafkaMessage,
  mutex,
  logger,
  consumer,
  prisma,
  MessageYupSchema,
  saveToDatabase,
}: HandleMessageConfig<Message>) => {
  //Going to mutex
  const release = await mutex.acquire()
  logger.info("Handling a message.")
  let message: Message
  try {
    message = JSON.parse(kafkaMessage?.value?.toString("utf8") ?? "")
  } catch (e) {
    logger.error("invalid message", e)
    await commit(kafkaMessage, consumer)
    release()
    return
  }

  try {
    await MessageYupSchema.validate(message)
  } catch (error) {
    logger.error("JSON VALIDATE FAILED: " + error, {
      message: JSON.stringify(message),
    })
    await commit(kafkaMessage, consumer)
    release()
    return
  }

  try {
    logger.info("Saving. Timestamp " + message.timestamp)
    if (!(await saveToDatabase(message, prisma, logger))) {
      logger.error("Could not save event to database")
    }
  } catch (error) {
    logger.error("Could not save event to database:", error)
  }
  await commit(kafkaMessage, consumer)
  //Releasing mutex
  release()
}

const commit = async (message: any, consumer: KafkaConsumer) => {
  if (commitCounter >= commitInterval) {
    await consumer.commitMessage(message)
    commitCounter = 0
  }
  commitCounter++
}
