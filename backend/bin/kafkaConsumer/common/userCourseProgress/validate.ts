import parseJSON from "json-parse-even-better-errors"
import { Message as KafkaMessage } from "node-rdkafka"
import * as yup from "yup"

import { userIdSchema } from "../validate"
import { Message } from "./interfaces"

const CURRENT_MESSAGE_FORMAT_VERSION = 1

const PointsByGroupYupSchema = yup.object().shape({
  group: yup.string().required(),
  max_points: yup.number().required(),
  n_points: yup.number().required(),
  progress: yup.number().required(),
  extra: yup.object(),
  // commented this out in case we need to stick some other stuff to extra
  /*.shape({
    tiers: yup.object(),
    exercises: yup.object(),
    projectCompletion: yup.boolean(),
    highestTier: yup.number(),
    totalExerciseCompletions: yup.number(),
  })*/
})

export const MessageYupSchema = yup.object().shape({
  timestamp: yup.date().required(),
  course_id: yup.string().length(36).required(),
  service_id: yup.string().length(36).required(),
  user_id: userIdSchema,
  progress: yup.array().of(PointsByGroupYupSchema).required(),
  message_format_version: yup
    .number()
    .min(CURRENT_MESSAGE_FORMAT_VERSION)
    .max(CURRENT_MESSAGE_FORMAT_VERSION)
    .required(),
})

const handleNullProgressImpl = (value: Message) => {
  if (!Array.isArray(value?.progress)) {
    return value
  }
  return {
    ...value,
    progress: value.progress.map((pointsByGroup) =>
      typeof pointsByGroup === "object" && pointsByGroup !== null
        ? {
            ...pointsByGroup,
            progress:
              pointsByGroup.progress === null || isNaN(pointsByGroup.progress)
                ? 0
                : pointsByGroup.progress,
          }
        : pointsByGroup,
    ),
  }
}

export const handleNullProgress = (message: KafkaMessage) => {
  let parsedMessage: Message
  try {
    parsedMessage = parseJSON(message?.value?.toString("utf8") ?? "") as Message
  } catch {
    // handleMessage logs and commits unparseable messages
    return message
  }

  return {
    ...message,
    value: Buffer.from(JSON.stringify(handleNullProgressImpl(parsedMessage))),
  }
}
