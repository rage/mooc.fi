import { validateMessageFormat, validatePointsByGroupArray } from "./validate"
import { Message } from "./interfaces"
import { saveToDatabase } from "./saveToDB"
import { Prisma } from "../../../generated/prisma-client"
let commitCounter = 0
const commitInterval = 100
export const handleMessage = async (
  kafkaMessage,
  mutex,
  logger,
  consumer,
  prisma: Prisma,
) => {
  //Going to mutex
  const release = await mutex.acquire()
  logger.info(kafkaMessage)
  let message: Message
  try {
    message = JSON.parse(kafkaMessage.value.toString("utf8"))
  } catch (e) {
    logger.error("invalid message", e)
    await commit(kafkaMessage, consumer)
    release()
    return
  }

  if (!validateMessageFormat(message)) {
    logger.error("JSON VALIDATE FAILED")
    await commit(kafkaMessage, consumer)
    release()
    return
  }
  try {
    if (!validatePointsByGroupArray(message.progress)) {
      logger.error("Progress is not valid")
      await commit(kafkaMessage, consumer)
      release()
      return
    }
  } catch (error) {
    logger.error("validating progress format failed with error:", error)
    await commit(kafkaMessage, consumer)
    release()
    return
  }

  try {
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

const commit = async (message, consumer) => {
  if (commitCounter >= commitInterval) {
    await consumer.commitMessage(message)
    commitCounter = 0
  }
  commitCounter++
}
