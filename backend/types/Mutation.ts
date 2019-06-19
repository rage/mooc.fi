import { prismaObjectType } from "nexus-prisma"
import * as mutations from "../resolvers/Mutation"
const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {
    mutations.addCourseMutations(t)
    mutations.addCourseAliasMutations(t)
    mutations.addCourseTranslationMutations(t)
    mutations.addCompletionRegisteredMutations(t)
    mutations.addServiceMutations(t)
    mutations.addStudyModuleMutations(t)
    mutations.addStudyModuleTranslationMutations(t)
    mutations.addUserCourseProgressMutations(t)
    mutations.addUserCourseServiceProgressMutations(t)
    mutations.addOrganizationMutations(t)
    mutations.addExerciseMutations(t)
    mutations.addExerciseCompletionMutations(t)
  },
})

export default Mutation
