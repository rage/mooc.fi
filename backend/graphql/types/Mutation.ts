// import { prismaObjectType } from "nexus-prisma"
// import { objectType } from "@nexus/schema"
import * as mutations from "../resolvers/Mutation"
import { mutationType } from "@nexus/schema"

const Mutation = mutationType({
  definition(t) {
    Object.values(mutations).forEach((fn) => fn(t))
  },
})

export default Mutation
