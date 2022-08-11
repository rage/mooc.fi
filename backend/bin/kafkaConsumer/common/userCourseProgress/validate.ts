import { Message as KafkaMessage } from "node-rdkafka"
import * as yup from "yup"

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
  user_id: yup.number(),
  progress: yup.array().of(PointsByGroupYupSchema).required(),
  message_format_version: yup
    .number()
    .min(CURRENT_MESSAGE_FORMAT_VERSION)
    .max(CURRENT_MESSAGE_FORMAT_VERSION)
    .required(),
})

const handleNullProgressImpl = (value: Message) => ({
  ...value,
  progress: value?.progress?.map((pointsByGroup) => ({
    ...pointsByGroup,
    progress:
      pointsByGroup.progress === null || isNaN(pointsByGroup.progress)
        ? 0
        : pointsByGroup.progress,
  })),
})

export const handleNullProgress = (message: KafkaMessage) => ({
  ...message,
  value: Buffer.from(
    JSON.stringify(
      handleNullProgressImpl(
        JSON.parse(message?.value?.toString("utf8") ?? ""),
      ),
    ),
  ),
})
