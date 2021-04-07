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

// Each partition has their own commit counter
let commitCounterMap = new Map<number, number>()

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

const commit = async (kafkaContext: KafkaContext, message: KafkaMessage) => {
  const { logger, consumer } = kafkaContext

  const commitCounter = commitCounterMap.get(message.partition) || 0
  commitCounterMap.set(message.partition, commitCounter + 1)

  if (commitCounter >= commitInterval) {
    logger.info(
      `Committing partition ${message.partition} offset ${message.offset}`,
    )
    commitCounterMap.set(message.partition, 0)

    consumer.commitMessage(message)
    reportQueueLength(kafkaContext, message.partition, message.offset)
  }
}

const reportQueueLength = (
  ctx: KafkaContext,
  partition_id: number,
  committedOffset: number,
) => {
  ctx.consumer.queryWatermarkOffsets(
    ctx.topic_name,
    partition_id,
    5000,
    (err, offsets) => {
      if (err) {
        ctx.logger.error(
          `Could not get offsets for topic ${ctx.topic_name} partition ${partition_id}`,
        )
        return
      }
      const messagesInQueue = offsets.highOffset - committedOffset

      ctx.logger.info(
        `Status for partition ${partition_id}: ${messagesInQueue} messages in queue.`,
        {
          lowOffset: offsets.lowOffset,
          highoffSet: offsets.highOffset,
          messageOffset: committedOffset,
        },
      )
    },
  )
}
