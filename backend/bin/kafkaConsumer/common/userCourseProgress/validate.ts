import * as yup from "yup"
import { Message as KafkaMessage, MessageValue } from "node-rdkafka"

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

const handleNullProgressImpl = (value: any) => ({
  ...value,
  progress: value?.progress?.map((progress: any) => ({
    ...progress,
    progress:
      progress.progress === null || isNaN(progress.progress)
        ? 0
        : progress.progress,
  })),
})

export const handleNullProgress = (message: KafkaMessage) =>
  ({
    ...message,
    value:
      typeof message.value === "string"
        ? JSON.stringify(handleNullProgressImpl(JSON.parse(message.value)))
        : handleNullProgressImpl(message.value),
  } as KafkaMessage)
