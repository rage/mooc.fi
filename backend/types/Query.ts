import { prismaObjectType } from "nexus-prisma"
import * as queries from "../resolvers/Query/index"

const Query = prismaObjectType({
  name: "Query",
  definition(t) {
    // reduce the possibility of forgetting to update a bit :p
    Object.values(queries).forEach(fn => fn(t))
    /*     queries.addUserQueries(t)
    queries.addCompletionQueries(t)
    queries.addCourseQueries(t)
    queries.addCourseAliasQueries(t)
    queries.addServiceQueries(t)
    queries.addCompletionRegisteredQueries(t)
    queries.addUserCourseProgressQueries(t)
    queries.addUserCourseServiceProgressQueries(t)
    queries.addOrganizationQueries(t)
    queries.addStudyModuleQueries(t)
    queries.addStudyModuleTranslationQueries(t)
    queries.addCourseTranslationQueries(t)
    queries.addExerciseQueries(t)
    queries.addExerciseCompletionQueries(t)
    queries.addOpenUniversityRegistrationLinkQueries(t)
    queries.addUserCourseSettingsQueries(t)
    queries.addUserOrganizationQueries(t)
    queries.addCourseOrganizationQueries(t) */
  },
})

export default Query
