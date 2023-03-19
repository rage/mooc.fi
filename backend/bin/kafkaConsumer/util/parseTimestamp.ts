import { DateTime } from "luxon"

type DateTimeKeys = keyof typeof DateTime
type DateTimeFromStringFunctions = {
  [K in DateTimeKeys]: K extends `from${infer Type}`
    ? (typeof DateTime)[K] extends (text: string) => DateTime
      ? `from${Type}`
      : never
    : never
}[DateTimeKeys]

const functions: Array<DateTimeFromStringFunctions> = [
  "fromISO",
  "fromSQL",
  "fromHTTP",
  "fromRFC2822",
]

export const parseTimestamp = (timestamp: string) => {
  let parsed

  for (const fn of functions) {
    try {
      parsed = DateTime[fn](timestamp)
    } catch {}

    if (parsed?.isValid) {
      return parsed
    }
  }

  throw new Error(`Couldn't parse timestamp ${timestamp}`)
}
