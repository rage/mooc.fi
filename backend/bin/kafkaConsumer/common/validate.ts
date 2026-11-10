import * as yup from "yup"

/** Upstream (TMC) user id as sent in Kafka messages. */
export const userIdSchema = yup.number().integer().positive()
