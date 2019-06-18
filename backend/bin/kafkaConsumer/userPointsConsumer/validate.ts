import DateTime from "luxon"
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
    m.service_id
  )
}

export const validateTimestamp = (timestamp: DateTime) => {
  return timestamp.invalid == null
}
