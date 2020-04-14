import { prismaObjectType } from "nexus-prisma"
import * as mutations from "../resolvers/Mutation"

const Mutation = prismaObjectType<"Mutation">({
  name: "Mutation",
  definition(t) {
    Object.values(mutations).forEach((fn) => fn(t))
  },
})

export default Mutation
