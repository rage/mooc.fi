import * as yup from "yup"

import { MessageYupSchema as UserPointsMessageYupSchema } from "../common/userPoints/validate"

const CURRENT_MESSAGE_FORMAT_VERSION = 1

export const MessageYupSchema = yup.object().shape({
  timestamp: yup.date().required(),
  user_id: yup.number().required(),
  course_id: yup.string().length(36).required(),
  exercises: yup.array(UserPointsMessageYupSchema).required(),
  message_format_version: yup
    .number()
    .min(CURRENT_MESSAGE_FORMAT_VERSION)
    .max(CURRENT_MESSAGE_FORMAT_VERSION)
    .required(),
})
