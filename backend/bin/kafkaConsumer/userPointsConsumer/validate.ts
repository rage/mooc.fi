import DateTime from "luxon"

const CURRENT_MESSAGE_FORMAT_VERSION = 1

export const validateMessageFormat = (messageObject): Boolean => {
  const m = messageObject
  return (
    m != undefined &&
    m.timestamp &&
    m.exercise_id &&
    m.n_points &&
    m.completed != null &&
    m.user_id &&
    m.course_id &&
    m.service_id &&
    m.message_format_version == CURRENT_MESSAGE_FORMAT_VERSION
  )
}

export const validateTimestamp = (timestamp: DateTime) => {
  return timestamp.invalid == null
}
