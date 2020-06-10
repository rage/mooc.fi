import { inputObjectType } from "@nexus/schema"

const VerifiedUserArg = inputObjectType({
  name: "VerifiedUserArg",
  definition(t) {
    t.string("display_name")
    t.string("personal_unique_code", { required: true })
    t.id("organization_id", { required: true })
    t.string("organization_secret", { required: true })
  },
})

export default VerifiedUserArg
