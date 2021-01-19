import { inputObjectType } from "nexus"

export const StudyModuleCreateArg = inputObjectType({
  name: "StudyModuleCreateArg",
  definition(t) {
    t.nonNull.string("slug")
    t.nullable.string("name")
    t.nullable.string("image")
    t.nullable.int("order")
    t.list.nullable.field("study_module_translations", {
      type: "StudyModuleTranslationUpsertInput",
    })
  },
})

export const StudyModuleUpsertArg = inputObjectType({
  name: "StudyModuleUpsertArg",
  definition(t) {
    t.nullable.id("id")
    t.nonNull.string("slug")
    t.nullable.string("new_slug")
    t.nullable.string("name")
    t.nullable.string("image")
    t.nullable.int("order")
    t.list.nullable.field("study_module_translations", {
      type: "StudyModuleTranslationUpsertInput",
    })
  },
})
