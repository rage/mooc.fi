import { inputObjectType, objectType } from "nexus"

export const SponsorTranslation = objectType({
  name: "SponsorTranslation",
  definition(t) {
    t.model.sponsor_id()
    t.model.sponsor()
    t.model.language()
    t.model.name()
    t.model.description()
    t.model.link()
    t.model.link_text()
    t.model.created_at()
    t.model.updated_at()
  },
})

export const SponsorTranslationCreateInput = inputObjectType({
  name: "SponsorTranslationCreateInput",
  definition(t) {
    t.nonNull.string("language")
    t.nonNull.string("name")
    t.string("description")
    t.string("link")
    t.string("link_text")
  },
})

export const SponsorTranslationUpsertInput = inputObjectType({
  name: "SponsorTranslationUpsertInput",
  definition(t) {
    t.nonNull.string("sponsor_id")
    t.nonNull.string("language")
    t.nonNull.string("name")
    t.string("description")
    t.string("link")
    t.string("link_text")
  },
})
