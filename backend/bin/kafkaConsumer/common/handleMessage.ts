import { PrismaClient } from "@prisma/client"
import { Mutex } from "../../lib/await-semaphore"
import { Logger } from "winston"
import { KafkaConsumer, Message as KafkaMessage } from "node-rdkafka"
import * as yup from "yup"
import config from "../kafkaConfig"
import {
  DatabaseInputError,
  KafkaMessageError,
  ValidationError,
} from "../../lib/errors"
import { Result } from "../../../util/result"
import winston from "winston/lib/winston/config"

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
  ) => Promise<Result<string, Error>>
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
  logger.info("Handling a message.", {
    topic: kafkaMessage.topic,
    offset: kafkaMessage.offset,
    partition: kafkaMessage.partition,
    key: kafkaMessage.key,
  })
  let message: Message
  try {
    message = JSON.parse(kafkaMessage?.value?.toString("utf8") ?? "")
  } catch (error) {
    logger.error(new KafkaMessageError("invalid message", kafkaMessage, error))
    await commit(kafkaMessage, consumer, logger)
    release()
    return
  }

  try {
    await MessageYupSchema.validate(message)
  } catch (error) {
    logger.error(new ValidationError("JSON validation failed", message, error))
    await commit(kafkaMessage, consumer, logger)
    release()
    return
  }

  try {
    logger.info("Saving message", { message: JSON.stringify(message) })

    const saveResult = await saveToDatabase(message, prisma, logger)

    if (saveResult.isOk()) {
      if (saveResult.hasValue()) logger.info(saveResult.value)
    } else {
      if (saveResult.hasError()) logger.error(saveResult.error)
    }
  } catch (error) {
    logger.error(
      new DatabaseInputError(
        "Could not save event to database",
        message,
        error,
      ),
    )
  }
  await commit(kafkaMessage, consumer, logger)
  //Releasing mutex
  release()
}

const commit = async (
  message: any,
  consumer: KafkaConsumer,
  logger: Logger,
) => {
  if (commitCounter >= commitInterval) {
    logger.info("Committing...")
    await consumer.commitMessage(message)
    commitCounter = 0
  }
  commitCounter++
}
