import { DateTime } from "luxon"

type DateTimeKeys = keyof typeof DateTime
// DateTime functions with pattern `from*` and signature (timestamp: string) => DateTime
type DateTimeFromStringFunctions = {
  [K in DateTimeKeys]: K extends `from${infer _}`
    ? typeof DateTime[K] extends (text: string) => DateTime
      ? typeof DateTime[K]
      : never
    : never
}[DateTimeKeys]

const functions: Array<DateTimeFromStringFunctions> = [
  DateTime.fromISO,
  DateTime.fromSQL,
  DateTime.fromHTTP,
  DateTime.fromRFC2822,
  
]

export const parseTimestamp = (timestamp: string) => {
  let parsed

  for (const fn of functions) {
    try {
      parsed = fn(timestamp)
    } catch {}

    if (parsed?.isValid) {
      return parsed
    }
  }

  throw new Error(`Couldn't parse timestamp ${timestamp}`)
}
