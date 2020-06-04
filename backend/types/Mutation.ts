// import { prismaObjectType } from "nexus-prisma"
import { objectType } from "@nexus/schema"
import * as mutations from "../resolvers/Mutation"

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    Object.values(mutations).forEach((fn) => fn(t))
  },
})

export default Mutation
