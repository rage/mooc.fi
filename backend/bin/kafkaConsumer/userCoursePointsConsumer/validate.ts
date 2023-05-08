import * as yup from "yup"

import { MessageYupSchema as UserPointsMessageYupSchema } from "../common/userPoints/validate"

const CURRENT_MESSAGE_FORMAT_VERSION = 1

const UserPointsExerciseMessageYupSchema = UserPointsMessageYupSchema.shape({
  original_submission_date: yup.date().when("attempted", {
    is: true,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.nullable().notRequired(),
  }),
})

export const MessageYupSchema = yup.object().shape({
  timestamp: yup.date().required(),
  user_id: yup.number().required(),
  course_id: yup.string().length(36).required(),
  exercises: yup.array(UserPointsExerciseMessageYupSchema).required(),
  message_format_version: yup
    .number()
    .min(CURRENT_MESSAGE_FORMAT_VERSION)
    .max(CURRENT_MESSAGE_FORMAT_VERSION)
    .required(),
})
