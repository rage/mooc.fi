import * as yup from "yup"

const CURRENT_MESSAGE_FORMAT_VERSION = 1

const ExerciseDataYupSchema = yup.object().shape({
  name: yup.string().required(),
  id: yup.string().required(),
  part: yup
    .number()
    .required()
    .transform((value, input) => {
      if (isNaN(value)) {
        return Number(input?.match(/^osa(\d+)$/)?.[1])
      }
      return value
    }),
  section: yup.number().required(),
  max_points: yup.number().required(),
})

export const MessageYupSchema = yup.object().shape({
  timestamp: yup.date().required(),
  course_id: yup.string().length(36).nullable(), // we catch the nulls in saveToDB
  service_id: yup.string().length(36).required(),
  data: yup.array().of(ExerciseDataYupSchema).required(),
  message_format_version: yup
    .number()
    .min(CURRENT_MESSAGE_FORMAT_VERSION)
    .max(CURRENT_MESSAGE_FORMAT_VERSION)
    .required(),
})
