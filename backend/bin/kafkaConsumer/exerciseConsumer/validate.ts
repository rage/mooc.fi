import DateTime from "luxon"
export const validateMessageFormat = (messageObject): Boolean => {
  const m = messageObject
  return (
    m != undefined &&
    m.timestamp &&
    m.service_id &&
    m.course_id &&
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
