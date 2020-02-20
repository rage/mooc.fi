const flattenKeys = <T extends Record<any, any>>(
  object: T,
  output: Record<keyof T | keyof T[keyof T], any> = {} as Record<
    keyof T | keyof T[keyof T],
    any
  >,
  prefix = "",
) => {
  Object.keys(object).forEach(key => {
    if (Array.isArray(object[key])) {
      Object.assign(
        output,
        ...Object.keys(object[key]).map(key2 => ({
          ...flattenKeys(object[key][key2], {}, `${key}[${key2}].`),
        })),
      )
    } else {
      output = {
        ...output,
        [`${prefix}${key}`]: object[key],
      }
    }
  })
  return output
}

export default flattenKeys
