import { inputObjectType } from "nexus"

export const UserArg = inputObjectType({
  name: "UserArg",
  definition(t) {
    t.nonNull.int("upstream_id")
    t.nonNull.string("first_name")
    t.nonNull.string("last_name")
    t.nonNull.string("username")
    t.nonNull.string("email")
    t.nonNull.boolean("research_consent")
  },
})
