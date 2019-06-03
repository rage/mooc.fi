import { prismaObjectType } from "nexus-prisma"
import * as mutations from "../resolvers/Mutation"
const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {
    mutations.addCourseMutations(t)
    mutations.addCourseAliasMutations(t)
    mutations.addCompletionRegisteredMutations(t)
    mutations.addServiceMutations(t)
    mutations.addUserCourseProgressMutations(t)
    mutations.addUserCourseServiceProgressMutations(t)
    mutations.addOrganizationMutations(t)
  },
})

export default Mutation
