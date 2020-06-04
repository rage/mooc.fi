// import { prismaObjectType } from "nexus-prisma"
import { objectType } from "@nexus/schema"
import * as queries from "../resolvers/Query/index"

const Query = objectType({
  name: "Query",
  definition(t) {
    // reduce the possibility of forgetting to update a bit :p
    Object.values(queries).forEach((fn) => fn(t))
  },
})

export default Query
