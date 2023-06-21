type ObjectKey = string | number | symbol

type NullFiltered<T> = T extends null
  ? Exclude<T, null>
  : T extends Array<infer R>
  ? Array<NullFiltered<R>>
  : T extends Record<ObjectKey, unknown>
  ? {
      [K in keyof T]: NullFiltered<T[K]>
    }
  : T

export function filterNull<T extends Record<ObjectKey, unknown>>(
  o: T,
): NullFiltered<T>
export function filterNull<T extends Record<ObjectKey, unknown>>(
  o: null | undefined,
): undefined
export function filterNull<T extends Record<ObjectKey, unknown>>(
  o?: T | null,
): NullFiltered<T> | undefined {
  return o
    ? (Object.fromEntries(
        Object.entries(o).map(([k, v]) => [k, v === null ? undefined : v]),
      ) as NullFiltered<T>)
    : undefined
}

export function filterNullRecursive<T extends Record<ObjectKey, unknown>>(
  o: T,
): NullFiltered<T>
export function filterNullRecursive<T extends Record<ObjectKey, unknown>>(
  o: null | undefined,
): undefined
export function filterNullRecursive<T extends Record<ObjectKey, unknown>>(
  o?: T | null,
): NullFiltered<T> | undefined {
  if (!o) {
    return undefined
  }

  const filtered = filterNull(o)

  if (!filtered) {
    return undefined
  }

  return Object.fromEntries(
    Object.entries(filtered).map(([k, v]) => {
      if (Array.isArray(v)) {
        return [k, v.map(filterNullRecursive)]
      }
      if (typeof v === "object" && v !== null) {
        return [k, filterNullRecursive(v as Record<ObjectKey, unknown>)]
      }
      return [k, v === null ? undefined : v]
    }),
  ) as NullFiltered<T>
}
