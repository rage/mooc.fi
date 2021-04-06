import { Message as KafkaMessage } from "node-rdkafka"
import * as yup from "yup"
import config from "../kafkaConfig"
import {
  DatabaseInputError,
  KafkaMessageError,
  ValidationError,
} from "../../lib/errors"
import { Result } from "../../../util/result"
import { KafkaContext } from "./kafkaContext"

let commitCounter = 0

const commitInterval = config.commit_interval

interface HandleMessageConfig<Message extends { timestamp: string }> {
  context: KafkaContext
  kafkaMessage: KafkaMessage
  MessageYupSchema: yup.ObjectSchema<any>
  saveToDatabase: (
    context: KafkaContext,
    message: Message,
  ) => Promise<Result<string, Error>>
}

export const handleMessage = async <Message extends { timestamp: string }>({
  kafkaMessage,
  context,
  MessageYupSchema,
  saveToDatabase,
}: HandleMessageConfig<Message>) => {
  const { mutex, logger } = context
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
    await commit(context, kafkaMessage)
    release()
    return
  }

  try {
    await MessageYupSchema.validate(message)
  } catch (error) {
    logger.error(new ValidationError("JSON validation failed", message, error))
    await commit(context, kafkaMessage)
    release()
    return
  }

  try {
    logger.info("Saving message", { message: JSON.stringify(message) })

    const saveResult = await saveToDatabase(context, message)

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
    console.log("Reason: ", error.message)
    console.log(error.stack)
  }
  await commit(context, kafkaMessage)
  //Releasing mutex
  release()
}

const commit = async (
  { consumer, logger }: KafkaContext,
  message: KafkaMessage,
) => {
  if (commitCounter >= commitInterval) {
    logger.info("Committing...")
    await consumer.commitMessage(message)
    commitCounter = 0
  }
  commitCounter++
}
