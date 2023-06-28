type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

type IdStripped<T> = T extends Array<infer U>
  ? Array<IdStripped<U>>
  : T extends Record<string | number | symbol, unknown>
  ? { [K in keyof T]: K extends "id" ? never : IdStripped<T[K]> }
  : T

const isObject = (
  value: unknown,
): value is Record<string | number | symbol, unknown> =>
  typeof value === "object" && value !== null

export function stripId<T>(data: T): IdStripped<T> {
  if (data === null || data === undefined || typeof data !== "object")
    return data as IdStripped<T>

  const strippedData = {} as Record<keyof T, any>

  for (const [key, value] of Object.entries(data) as Entries<T>) {
    if (key === "id") continue
    if (Array.isArray(value)) {
      strippedData[key] = value.map(stripId)
    } else if (isObject(value)) {
      strippedData[key] = stripId(value)
    } else {
      strippedData[key] = value
    }
  }

  return strippedData as IdStripped<T>
}
