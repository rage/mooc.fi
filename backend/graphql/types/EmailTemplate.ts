import { schema } from "nexus"

schema.objectType({
  name: "email_template",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.html_body()
    t.model.name()
    t.model.title()
    t.model.txt_body()
    t.model.course()
    t.model.email_delivery()
  },
})
