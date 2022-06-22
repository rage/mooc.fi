import { enumType, objectType } from "nexus"

import { RequiredForCompletionEnum } from "../typeDefs"

function convertTsEnum(toConvert: any) {
  const converted: { [key: string]: number } = {}

  Object.keys(toConvert).forEach((key) => {
    if (/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(key)) {
      converted[key] = toConvert[key]
    }
  })

  return converted
}

export const RequiredForCompletionType = enumType({
  name: "RequiredForCompletionType",
  members: convertTsEnum(RequiredForCompletionEnum),
})

export const RequiredForCompletion = objectType({
  name: "RequiredForCompletion",
  definition(t) {
    t.nonNull.field("type", {
      type: "RequiredForCompletionType",
    })
    t.int("current_amount")
    t.int("required_amount")
    t.list.field("required_actions", {
      type: "ExerciseCompletionRequiredAction",
    })
  },
})
