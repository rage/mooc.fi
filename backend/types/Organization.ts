import { prismaObjectType } from "nexus-prisma"

const Organization = prismaObjectType<"Organization">({
  name: "Organization",
  definition(t) {
    t.prismaFields({ filter: ["secret_key"] })
  },
})
export default Organization
