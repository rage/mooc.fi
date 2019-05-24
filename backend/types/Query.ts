import { prismaObjectType } from "nexus-prisma"
import { ForbiddenError, UserInputError } from "apollo-server-core"
import { stringArg, intArg, idArg } from "nexus/dist"
import { Course } from "../generated/prisma-client"
import fetchCompletions from "../middlewares/fetchCompletions"
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
      resolve: (_, { email }, ctx) => resolvers.currentUser(_, { email }, ctx),
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
      resolve: (_, { course, first, after, last, before }, ctx) =>
        resolvers.completions(_, { course, first, after, last, before }, ctx),
    })

    t.list.field("courses", {
      type: "Course",
      resolve: (_, args, ctx) => resolvers.courses(_, args, ctx),
    })
    t.list.field("openUniversityCourses", {
      type: "OpenUniversityCourse",
      resolve: (_, args, ctx) => resolvers.openUniversityCourses(_, args, ctx),
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
      resolve: (_, { course, first, after, last, before }, ctx) =>
        resolvers.registeredCompletions(
          _,
          { course, first, after, last, before },
          ctx,
        ),
    })

    t.list.field("services", {
      type: "Service",
      resolve: (_, args, ctx) => resolvers.services(_, args, ctx)
    })
  },
})

export default Query
