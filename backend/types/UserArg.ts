import { inputObjectType } from "nexus/dist"

const UserArg = inputObjectType({
  name: "UserArg",
  definition(t) {
    t.int("upstream_id", { required: true })
    t.string("first_name", { required: true })
    t.string("last_name", { required: true })
    t.string("username", { required: true })
    t.string("email", { required: true })
    t.boolean("research_consent", { required: true })
  },
})

export default UserArg
