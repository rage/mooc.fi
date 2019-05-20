import { prismaObjectType } from "nexus-prisma";
import { stringArg, idArg, arg } from "nexus/dist";
import * as resolvers from "../resolvers/Mutation"
const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.field("addCourse", {
      type: "Course",
      args: {
        name: stringArg(),
        slug: stringArg()
      },
      resolve: (_, { name, slug }, ctx) => resolvers.addCourse(_, { name, slug }, ctx)
    })

    t.field("addOpenUniversityCourse", {
      type: "OpenUniversityCourse",
      args: {
        course_code: stringArg(),
        course: idArg(),
      },
      resolve: (_, { course_code, course }, ctx) =>
        resolvers.addOpenUniversityCourse(_, { course_code, course }, ctx)
    })

    t.list.field("registerCompletion", {
      type: "CompletionRegistered",
      args: {
        organisation: stringArg(),
        completions: arg({ type: "CompletionArg", list: true })
      },
      resolve: (_, args, ctx) => resolvers.registerCompletion(_, args, ctx)
    })
  }
});

export default Mutation