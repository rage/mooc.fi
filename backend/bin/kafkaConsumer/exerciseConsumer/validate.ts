import DateTime from "luxon"

const CURRENT_MESSAGE_FORMAT_VERSION = 1
export const validateMessageFormat = (messageObject): Boolean => {
  const m = messageObject
  return (
    m != undefined &&
    m.timestamp &&
    m.service_id &&
    m.course_id &&
    m.message_format_version == CURRENT_MESSAGE_FORMAT_VERSION &&
    m.data &&
    validateData(m.data)
  )
}

export const validateTimestamp = (timestamp: DateTime) => {
  return timestamp.invalid == null
}

const validateData = (dataArray: any[]) => {
  const notValid = dataArray.some(
    data =>
      !(
        data != undefined &&
        data.id &&
        data.name &&
        data.part &&
        data.section &&
        data.max_points
      ),
  )
  return !notValid
}
