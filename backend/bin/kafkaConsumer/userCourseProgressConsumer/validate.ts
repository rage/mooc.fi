import { DateTime } from "luxon"
import { PointsByGroup } from "./interfaces"

const CURRENT_MESSAGE_FORMAT_VERSION = 1
export const validateTimestamp = (timestamp: DateTime) => {
  return timestamp.invalid == null
}

export const validateMessageFormat = (messageObject): Boolean => {
  const m = messageObject
  return (
    m != undefined &&
    m.timestamp &&
    m.user_id &&
    m.course_id &&
    m.progress &&
    m.service_id &&
    m.message_format_version == CURRENT_MESSAGE_FORMAT_VERSION
  )
}

export const validatePointsByGroupArray = (
  pointsByGroupArray: [PointsByGroup],
): Boolean => {
  if (pointsByGroupArray.length < 1) return false
  return !pointsByGroupArray.some(entry => {
    return !validatePointsByGroup(entry)
  })
}

export const validatePointsByGroup = (
  pointsByGroup: PointsByGroup,
): Boolean => {
  return (
    pointsByGroup != null &&
    pointsByGroup.group &&
    pointsByGroup.max_points &&
    !isNaN(pointsByGroup.max_points) &&
    pointsByGroup.n_points &&
    !isNaN(pointsByGroup.n_points) &&
    pointsByGroup.progress &&
    !isNaN(pointsByGroup.progress)
  )
}
