import { prismaObjectType } from "nexus-prisma"
import * as mutations from "../resolvers/Mutation"
const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {
    Object.values(mutations).forEach(fn => fn(t))
  },
})

export default Mutation
