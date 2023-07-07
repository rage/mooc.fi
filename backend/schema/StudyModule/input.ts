import { inputObjectType } from "nexus"

export const StudyModuleCreateArg = inputObjectType({
  name: "StudyModuleCreateArg",
  definition(t) {
    t.nonNull.string("slug")
    t.string("name")
    t.string("image")
    t.int("order")
    t.list.nonNull.field("study_module_translations", {
      type: "StudyModuleTranslationUpsertInput",
    })
  },
})

export const StudyModuleUpsertArg = inputObjectType({
  name: "StudyModuleUpsertArg",
  definition(t) {
    t.id("id")
    t.nonNull.string("slug")
    t.string("new_slug")
    t.string("name")
    t.string("image")
    t.int("order")
    t.list.nonNull.field("study_module_translations", {
      type: "StudyModuleTranslationUpsertInput",
    })
  },
})

export const StudyModuleOrderByInput = inputObjectType({
  name: "StudyModuleOrderByInput",
  definition(t) {
    t.field("id", { type: "SortOrder" })
    t.field("slug", { type: "SortOrder" })
    t.field("name", { type: "SortOrder" })
    t.field("image", { type: "SortOrder" })
    t.field("order", { type: "SortOrder" })
  },
})
