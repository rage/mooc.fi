import { prismaObjectType } from "nexus-prisma"
import * as queries from "../resolvers/Query/index"

const Query = prismaObjectType({
  name: "Query",
  definition(t) {
    queries.addUserQueries(t)
    queries.addCompletionQueries(t)
    queries.addCourseQueries(t)
    queries.addCourseAliasQueries(t)
    queries.addServiceQueries(t)
    queries.addCompletionRegisteredQueries(t)
    queries.addUserCourseProgressQueries(t)
    queries.addUserCourseServiceProgressQueries(t)
    queries.addOrganizationQueries(t)
  },
})

export default Query
