import * as yup from "yup"

const CURRENT_MESSAGE_FORMAT_VERSION = 1

export const MessageYupSchema = yup.object().shape({
  timestamp: yup.date().required(),
  exercise_id: yup.string().required(),
  n_points: yup.number().required(),
  completed: yup.boolean().required(),
  user_id: yup
    .string()
    .length(36)
    .required(),
  course_id: yup
    .string()
    .length(36)
    .required(),
  service_id: yup
    .string()
    .length(36)
    .required(),
  required_actions: yup.string(),
  message_format_version: yup
    .number()
    .min(CURRENT_MESSAGE_FORMAT_VERSION)
    .max(CURRENT_MESSAGE_FORMAT_VERSION)
    .required(),
})
