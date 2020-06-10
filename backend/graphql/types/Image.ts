import { schema } from "nexus"

schema.objectType({
  name: "image",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.compressed()
    t.model.compressed_mimetype()
    t.model.default()
    t.model.encoding()
    t.model.name()
    t.model.original()
    t.model.original_mimetype()
    t.model.uncompressed()
    t.model.uncompressed_mimetype()
    t.model.course()
  },
})
