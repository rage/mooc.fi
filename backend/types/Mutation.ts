import { prismaObjectType } from "nexus-prisma"
import { stringArg, idArg, arg } from "nexus/dist"
import * as resolvers from "../resolvers/Mutation"
const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.field("addCourse", {
      type: "Course",
      args: {
        name: stringArg(),
        slug: stringArg(),
      },
      resolve: async (_, { name, slug }, ctx) =>
        await resolvers.addCourse(_, { name, slug }, ctx),
    })

    t.field("addCourseAlias", {
      type: "CourseAlias",
      args: {
        course_code: stringArg(),
        course: idArg(),
      },
      resolve: async (_, { course_code, course }, ctx) =>
        await resolvers.addCourseAlias(_, { course_code, course }, ctx),
    })

    t.list.field("registerCompletion", {
      type: "CompletionRegistered",
      args: {
        organisation: stringArg(),
        completions: arg({ type: "CompletionArg", list: true }),
      },
      resolve: async (_, args, ctx) =>
        await resolvers.registerCompletion(_, args, ctx),
    })

    t.field("addService", {
      type: "Service",
      args: {
        url: stringArg({ required: true }),
      },
      resolve: async (_, { url }, ctx) =>
        await resolvers.addService(_, { url }, ctx),
    })
  },
})

export default Mutation
