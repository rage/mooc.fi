import { prismaObjectType } from "nexus-prisma"
import { stringArg, intArg, idArg } from "nexus/dist"
import * as resolvers from "../resolvers/Query"

const Query = prismaObjectType({
  name: "Query",
  definition(t) {
    //t.prismaFields(["user"]); // TODO add access control
    t.list.field("users", {
      type: "User",
      resolve: async (_, args, ctx) => await resolvers.users(_, args, ctx),
    })

    t.field("currentUser", {
      type: "User",
      args: { email: stringArg() },
      resolve: async (_, { email }, ctx) =>
        await resolvers.currentUser(_, { email }, ctx),
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
      resolve: async (_, { course, first, after, last, before }, ctx) =>
        await resolvers.completions(
          _,
          { course, first, after, last, before },
          ctx,
        ),
    })

    t.list.field("courses", {
      type: "Course",
      resolve: async (_, args, ctx) => await resolvers.courses(_, args, ctx),
    })
    t.list.field("CourseAliases", {
      type: "CourseAlias",
      resolve: async (_, args, ctx) =>
        await resolvers.CourseAliass(_, args, ctx),
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
      resolve: async (_, { course, first, after, last, before }, ctx) =>
        await resolvers.registeredCompletions(
          _,
          { course, first, after, last, before },
          ctx,
        ),
    })

    t.list.field("services", {
      type: "Service",
      resolve: async (_, args, ctx) => await resolvers.services(_, args, ctx),
    })
  },
})

export default Query
