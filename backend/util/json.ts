export const indent = Symbol.for("indent")
export const newline = Symbol.for("newline")

export const stringifyWithIndent = (value: any) =>
  JSON.stringify(value, null, value[indent])
