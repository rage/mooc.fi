import * as yup from "yup"

const CURRENT_MESSAGE_FORMAT_VERSION = 1

export const MessageYupSchema = yup.object().shape({
  timestamp: yup.date().required(),
  exercise_id: yup.string().required(),
  n_points: yup.number().nullable(),
  completed: yup.boolean().required(),
  user_id: yup.number().required(),
  course_id: yup.string().length(36).required(),
  service_id: yup.string().length(36).required(),
  required_actions: yup.array(yup.string()),
  attempted: yup.boolean().nullable(),
  original_submission_date: yup.date(),
  message_format_version: yup
    .number()
    .min(CURRENT_MESSAGE_FORMAT_VERSION)
    .max(CURRENT_MESSAGE_FORMAT_VERSION)
    .required(),
})
