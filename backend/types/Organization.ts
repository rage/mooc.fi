import { prismaObjectType } from "nexus-prisma"

const Organization = prismaObjectType({
  name: "Organization",
  definition(t) {
    t.prismaFields({ filter: ["secret_key"] })
  },
})
export default Organization
