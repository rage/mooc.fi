import parseJSON from "json-parse-even-better-errors"
import { Message as KafkaMessage } from "node-rdkafka"
import * as yup from "yup"

import {
  DatabaseInputError,
  KafkaMessageError,
  ValidationError,
  Warning,
} from "../../../lib/errors"
import { stringifyWithIndent } from "../../../util/json"
import { Result } from "../../../util/result"
import config from "../kafkaConfig"
import { KafkaContext } from "./kafkaContext"

// Each partition has their own commit counter
const commitCounterMap = new Map<number, number>()

const commitInterval = config.commit_interval

interface HandleMessageArgs<Message extends { timestamp: string }> {
  context: KafkaContext
  kafkaMessage: KafkaMessage
  MessageYupSchema: yup.ObjectSchema<any>
  saveToDatabase: (
    context: KafkaContext,
    message: Message,
  ) => Promise<Result<string | Warning, Error>>
}

export const handleMessage = async <Message extends { timestamp: string }>({
  kafkaMessage,
  context,
  MessageYupSchema,
  saveToDatabase,
}: HandleMessageArgs<Message>) => {
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
    message = parseJSON(kafkaMessage?.value?.toString("utf8") ?? "") as Message
  } catch (error: any) {
    logger.error(new KafkaMessageError("invalid message", kafkaMessage, error))
    await commit(context, kafkaMessage)
    release()

    return
  }

  try {
    await MessageYupSchema.validate(message)
  } catch (error: any) {
    logger.error(new ValidationError("JSON validation failed", message, error))
    await commit(context, kafkaMessage)
    release()

    return
  }

  try {
    logger.info("Saving message", { message: stringifyWithIndent(message) })

    const saveResult = await saveToDatabase(context, message)

    if (saveResult.isOk()) {
      if (saveResult.hasValue()) {
        logger.info(saveResult.value)
      }
    } else if (saveResult.isWarning()) {
      if (saveResult.hasValue()) {
        logger.warn(saveResult.value.message)
      }
    } else {
      if (saveResult.hasError()) {
        logger.error(saveResult.error)
      }
    }
  } catch (error: any) {
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

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
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
        ctx.logger.warn(
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
