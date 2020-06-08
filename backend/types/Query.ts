// import { prismaObjectType } from "nexus-prisma"
import * as queries from "../resolvers/Query/index"
import { extendType } from "@nexus/schema"

const Query = extendType({
  type: "Query",
  definition(t) {
    // reduce the possibility of forgetting to update a bit :p
    Object.values(queries).forEach((fn) => fn(t))
  },
})

export default Query
