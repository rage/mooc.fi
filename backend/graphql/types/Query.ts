// import { prismaObjectType } from "nexus-prisma"
import * as queries from "../resolvers/Query/index"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    console.log(queries)
    // reduce the possibility of forgetting to update a bit :p
    Object.values(queries).forEach((fn) => fn(t))
  },
})

// export default Query
