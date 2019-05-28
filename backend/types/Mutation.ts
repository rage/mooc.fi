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
      resolve: (_, args, ctx) => resolvers.addCourse(_, args, ctx),
    })

    t.field("addCourseAlias", {
      type: "CourseAlias",
      args: {
        course_code: stringArg(),
        course: idArg(),
      },
      resolve: (_, args, ctx) => resolvers.addCourseAlias(_, args, ctx),
    })

    t.list.field("registerCompletion", {
      type: "CompletionRegistered",
      args: {
        organisation: stringArg(),
        completions: arg({ type: "CompletionArg", list: true }),
      },
      resolve: (_, args, ctx) => resolvers.registerCompletion(_, args, ctx),
    })

    t.field("addService", {
      type: "Service",
      args: {
        url: stringArg({ required: true }),
        name: stringArg({ required: true }),
      },
      resolve: (_, args, ctx) => resolvers.addService(_, args, ctx),
    })

    t.field("addUserCourseProgress", {
      type: "UserCourseProgress",
      args: {
        user_id: idArg({ required: true }),
        course_id: idArg({ required: true }),
        progress: arg({ type: "ProgressArg", required: true }),
      },
      resolve: (_, args, ctx) => resolvers.addUserCourseProgress(_, args, ctx),
    })

    t.field("addUserCourseServiceProgress", {
      type: "UserCourseServiceProgress",
      args: {
        progress: arg({ type: "ProgressArg", required: true }),
        service_id: idArg({ required: true }),
        user_course_progress_id: idArg({ required: true }),
      },
      resolve: (_, args, ctx) =>
        resolvers.addUserCourseServiceProgress(_, args, ctx),
    })
  },
})

export default Mutation
