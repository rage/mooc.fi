import { prismaObjectType } from "nexus-prisma"

const Organization = prismaObjectType({
  name: "Organization",
  definition(t) {
    t.prismaFields([
      "id",
      "created_at",
      "updated_at",
      "name",
      "slug",
      "completions_registered",
    ])
  },
})
export default Organization
