import { prisma, Prisma, Int, User, Course, OpenUniversityCourse } from "./generated/prisma-client";
import datamodelInfo from "./generated/nexus-prisma";
import * as path from "path";
import { stringArg, idArg, convertSDL, subscriptionField, objectType, intArg } from "nexus";
import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
import { GraphQLServer } from "graphql-yoga";
import { AuthenticationError, ForbiddenError } from "apollo-server-core";
import TmcClient from "./services/tmc";
import fetchUser from "./middlewares/FetchUser";
import fetchCompletions from './middlewares/fetchCompletions'
const { UserInputError } = require('apollo-server-core')


import * as winston from "winston";
import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "backend" },
  transports: [new winston.transports.Console()]
});

const Query = prismaObjectType({
  name: "Query",
  definition(t) {
    //t.prismaFields(["user"]); // TODO add access control
    t.list.field("users", {
      type: "User",
      resolve: (_, args, ctx) => {
        if (!ctx.user.administrator) {
          throw new ForbiddenError("Access Denied");
        }
        return ctx.prisma.users();
      }
    });

    t.field("currentUser", {
      type: "User",
      args: { email: stringArg() },
      resolve: (_, { email }, ctx) => {
        return ctx.user;
      }
    });

    t.list.field("completions", {
      type: "Completion",
      args: {
        course: stringArg(),
        first: intArg(),
        after: idArg()
      },
      resolve: async (_, { course, first, after }, ctx) => {
        if (!ctx.user.administrator) {
          throw new ForbiddenError("Access Denied");
        }
        if (!first || first > 50) {
          ctx.disableRelations = true
        }
        console.log("A")
        const courseWithSlug: Course = await ctx.prisma.course(
          { slug: course }
        )
        console.log("B")
        if (!courseWithSlug) {
          const courseFromAvoinCourse: Course = await ctx.prisma.openUniversityCourse(
            { course_code: course }
          ).course()
          if (!courseFromAvoinCourse) {
            throw new UserInputError("Invalid course identifier")
          }
          course = courseFromAvoinCourse.slug
        }
        const completions = await fetchCompletions({ course, first, after }, ctx);

        return completions
      }
    })

    t.list.field("courses", {
      type: "Course",
      resolve: async (_, args, ctx) => {
        if (!ctx.user.administrator) {
          throw new ForbiddenError("Access Denied");
        }
        return ctx.prisma.courses()
      }
    })
    t.list.field("openUniversityCourses", {
      type: "OpenUniversityCourse",
      resolve: async (_, args, ctx) => {
        if (!ctx.user.administrator) {
          throw new ForbiddenError("Access Denied");
        }
        return ctx.prisma.openUniversityCourses()
      }
    })
  }
});


const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.field("addCourse", {
      type: "Course",
      args: {
        name: stringArg(),
        slug: stringArg()
      },
      resolve: async (_, { name, slug }, ctx) => {
        if (!ctx.user.administrator) {
          throw new ForbiddenError("Access Denied");
        }
        const prisma: Prisma = ctx.prisma
        const newCourse: Course = await prisma.createCourse({
          name: name,
          slug: slug
        })
        return newCourse
      }
    })

    t.field("addOpenUniversityCourse", {
      type: "OpenUniversityCourse",
      args: {
        course_code: stringArg(),
        course: idArg(),
      },
      resolve: async (_, { course_code, course }, ctx) => {
        if (!ctx.user.administrator) {
          throw new ForbiddenError("Access Denied");
        }
        const prisma: Prisma = ctx.prisma
        const newOpenUniversityCourse: OpenUniversityCourse = await prisma.createOpenUniversityCourse({
          course_code: course_code,
          course: { connect: { id: course } }
        })
        return newOpenUniversityCourse
      }
    })
    // t.field("registerCompletion", {
    //   type: "CompletionRegistered",
    //   args: {
    //     organisation: stringArg(),
    //     completions: [{completion_id: idArg(), real_student_number: stringArg()}]
    //   },
    //   resolve: async (_, args, ctx) => {
    //     return null
    //   }
    // })
  }
});


const Completion = prismaObjectType({
  name: "Completion",
  definition(t) {
    t.prismaFields(["id", "createdAt", "updatedAt", "course", "completion_language", "email",
      "student_number", "user_upstream_id"])

    t.field("user", {
      type: "User",
      resolve: (parent, args, ctx) => {
        if (ctx.disableRelations) {
          throw new ForbiddenError("Cannot query relations when asking for more than 50 objects")
        }
        return ctx.prisma.completion({id: parent.id}).user()
      }
    })

  }
})


const schema = makePrismaSchema({
  types: [Query, Mutation, Completion],

  prisma: {
    datamodelInfo,
    client: prisma
  },

  outputs: {
    schema: path.join(__dirname, "./generated/schema.graphql"),
    typegen: path.join(__dirname, "./generated/nexus.ts")
  },

  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, './context.ts'),
        alias: 'ctx',
      },
    ],
    contextType: 'ctx.Context',
  },
});

const server = new GraphQLServer({
  schema,
  context: req => ({ prisma, ...req }),
  middlewares: [fetchUser]
});

const serverStartOptions = {
  formatParams(o) {
    logger.info("Query");
    return o;
  },
  formatError: error => {
    logger.warn(error);
    return error;
  },
  formatResponse: (response, query) => {
    return response;
  }
};

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
  serverStartOptions["playground"] = false;
}

server.start(serverStartOptions, () =>
  console.log("Server is running on http://localhost:4000")
);
