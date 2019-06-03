import { prismaObjectType } from "nexus-prisma"
import { stringArg, intArg, idArg } from "nexus/dist"
import * as resolvers from "../resolvers/Query"

const Query = prismaObjectType({
  name: "Query",
  definition(t) {
    //t.prismaFields(["user"]); // TODO add access control
    t.list.field("users", {
      type: "User",
      resolve: (_, args, ctx) => resolvers.users(_, args, ctx),
    })

    t.field("currentUser", {
      type: "User",
      args: { email: stringArg() },
      resolve: (_, args, ctx) => resolvers.currentUser(_, args, ctx),
    })

    t.list.field("completions", {
      type: "Completion",
      args: {
        course: stringArg(),
        first: intArg(),
        after: idArg(),
        last: intArg(),
        before: idArg(),
      },
      resolve: (_, args, ctx) => resolvers.completions(_, args, ctx),
    })

    t.list.field("courses", {
      type: "Course",
      resolve: (_, args, ctx) => resolvers.courses(_, args, ctx),
    })

    t.field("course", {
      type: "Course",
      args: {
        slug: stringArg(),
        id: idArg(),
      },
      resolve: (_, args, ctx) => resolvers.course(_, args, ctx),
    })
    t.list.field("CourseAliases", {
      type: "CourseAlias",
      resolve: (_, args, ctx) => resolvers.courseAliases(_, args, ctx),
    })

    t.list.field("registeredCompletions", {
      type: "CompletionRegistered",
      args: {
        course: stringArg(),
        first: intArg(),
        after: idArg(),
        last: intArg(),
        before: idArg(),
      },
      resolve: (_, args, ctx) => resolvers.registeredCompletions(_, args, ctx),
    })

    t.list.field("services", {
      type: "Service",
      resolve: (_, args, ctx) => resolvers.services(_, args, ctx),
    })

    t.field("service", {
      type: "Service",
      args: {
        service_id: idArg(),
      },
      resolve: (_, args, ctx) => resolvers.service(_, args, ctx),
    })

    t.list.field("UserCourseProgresses", {
      type: "UserCourseProgress",
      args: {
        user_id: idArg(),
        course_id: idArg(),
        first: intArg(),
        after: idArg(),
        last: intArg(),
        before: idArg(),
      },
      resolve: (_, args, ctx) => resolvers.userCourseProgresses(_, args, ctx),
    })

    t.field("UserCourseProgress", {
      type: "UserCourseProgress",
      args: {
        user_id: idArg({ required: true }),
        course_id: idArg({ required: true }),
      },
      resolve: (_, args, ctx) => resolvers.userCourseProgress(_, args, ctx),
    })

    t.list.field("UserCourseServiceProgresses", {
      type: "UserCourseServiceProgress",
      args: {
        user_id: idArg(),
        course_id: idArg(),
        service_id: idArg(),
        first: intArg(),
        after: idArg(),
        last: intArg(),
        before: idArg(),
      },
      resolve: (_, args, ctx) =>
        resolvers.userCourseServiceProgresses(_, args, ctx),
    })

    t.field("UserCourseServiceProgress", {
      type: "UserCourseServiceProgress",
      args: {
        user_id: idArg(),
        course_id: idArg(),
        service_id: idArg(),
      },
      resolve: (_, args, ctx) =>
        resolvers.userCourseServiceProgress(_, args, ctx),
    })

    t.list.field("organizations", {
      type: "Organization",
      args: {
        first: intArg(),
        after: idArg(),
        last: intArg(),
        before: idArg(),
      },
      resolve: (_, args, ctx) => resolvers.organizations(_, args, ctx),
    })

    t.field("organization", {
      type: "Organization",
      args: {
        id: idArg(),
      },
      resolve: (_, args, ctx) => resolvers.organization(_, args, ctx),
    })
  },
})

export default Query
