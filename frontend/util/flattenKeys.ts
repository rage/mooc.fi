/**
 * Flattens an object. Example:
 *
 * {
 *   a: { b: 1 },
 *   b: [{ a: 2 }, { a: 3 }],
 *   c: 3
 * }
 *
 * becomes
 *
 * {
 *  a.b: 1,
 *  b[0].a: 2,
 *  b[1].a: 3,
 *  c: 3
 * }
 *
 * If there are key name collisions, the results can differ from call to call.
 *
 * @param object object to be flattened
 * @param output intermediate value, should be left empty on call
 * @param prefix intermediate prefix, should usually be left empty unless same prefix explicitly wanted
 */
const flattenKeys = <
  T extends Record<string, any>,
  TOut extends Record<keyof T | keyof T[keyof T], any>,
>(
  object: T,
  output: TOut = {} as TOut,
  prefix = "",
) => {
  Object.keys(object).forEach((key) => {
    const path: T[keyof T] = object[key]
    if (Array.isArray(path)) {
      // is array, build path obj[0].next
      Object.assign(
        output,
        ...Object.keys(path).map((key2) => ({
          ...flattenKeys(path[key2], {}, `${key}[${key2}].`),
        })),
      )
    } else if (
      // TODO/FIXME: hack for react-hook-form errors - if we had fields named message and type in same form, this would break
      typeof path === "object" &&
      !!path &&
      !(path.message && path.type)
    ) {
      // is object, build path obj.key.next
      const outkey = Array.isArray(key) ? `[${key}]` : key
      Object.assign(
        output,
        flattenKeys(
          path,
          {} as Record<keyof T[keyof T], any>,
          `${prefix}${outkey}.`,
        ),
      )
    } else {
      // else base case, obj.key = value
      output = {
        ...output,
        [`${prefix}${key}`]: path,
      }
    }
  })
  return output
}

export default flattenKeys
