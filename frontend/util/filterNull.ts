type NullFiltered<T> = T extends null
  ? Exclude<T, null>
  : T extends Array<infer R>
  ? Array<NullFiltered<R>>
  : T extends Record<PropertyKey, unknown>
  ? {
      [K in keyof T]: NullFiltered<T[K]>
    }
  : T

export function filterNull<T extends Record<PropertyKey, unknown>>(
  o: T,
): NullFiltered<T>
export function filterNull<T extends Record<PropertyKey, unknown>>(
  o: null | undefined,
): undefined
export function filterNull<T extends Record<PropertyKey, unknown>>(
  o?: T | null,
): NullFiltered<T> | undefined {
  if (
    typeof o === "string" ||
    typeof o === "number" ||
    typeof o === "boolean"
  ) {
    return o
  }

  if (Array.isArray(o)) {
    return o.map(filterNull) as NullFiltered<T>
  }

  return o
    ? (Object.fromEntries(
        Object.entries(o).map(([k, v]) => [k, v === null ? undefined : v]),
      ) as NullFiltered<T>)
    : undefined
}

export function filterNullRecursive<T extends Record<PropertyKey, unknown>>(
  o: T,
): NullFiltered<T>
export function filterNullRecursive<T extends Record<PropertyKey, unknown>>(
  o: null | undefined,
): undefined
export function filterNullRecursive<T extends Record<PropertyKey, unknown>>(
  o?: T | null,
): NullFiltered<T> | undefined {
  if (!o) {
    return undefined
  }

  if (
    typeof o === "string" ||
    typeof o === "number" ||
    typeof o === "boolean"
  ) {
    return o
  }

  const filtered = filterNull(o)

  if (!filtered) {
    return undefined
  }

  if (Array.isArray(filtered)) {
    return filtered.map(filterNullRecursive) as NullFiltered<T>
  }

  return Object.fromEntries(
    Object.entries(filtered).map(([k, v]) => {
      if (Array.isArray(v)) {
        return [k, v.map(filterNullRecursive)]
      }
      if (typeof v === "object" && v !== null) {
        return [k, filterNullRecursive(v as Record<PropertyKey, unknown>)]
      }
      return [k, v === null ? undefined : v]
    }),
  ) as NullFiltered<T>
}
