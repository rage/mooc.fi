import { inputObjectType } from "nexus"

export const UserCreateArg = inputObjectType({
  name: "UserCreateArg",
  definition(t) {
    t.nonNull.int("upstream_id")
    t.nonNull.string("first_name")
    t.nonNull.string("last_name")
    t.nonNull.string("username")
    t.nonNull.string("email")
    t.nonNull.boolean("research_consent")
  },
})

export const UserUpdateArg = inputObjectType({
  name: "UserUpdateArg",
  definition(t) {
    t.nullable.id("id")
    t.string("first_name")
    t.string("last_name")
    t.string("email")
    t.boolean("research_consent")
    t.string("real_student_number")
  },
})
