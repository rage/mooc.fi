import { prisma, Prisma, Int } from "./generated/prisma-client";
import datamodelInfo from "./generated/nexus-prisma";
import * as path from "path";
import { stringArg, idArg } from "nexus";
import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
import { GraphQLServer } from "graphql-yoga";
import { AuthenticationError } from "apollo-server-core";
import TmcClient from "./services/tmc";
import fetchUser from "./middlewares/FetchUser";

const Query = prismaObjectType({
  name: "Query",
  definition(t) {
    t.prismaFields(["user"]);
    t.list.field("users", {
      type: "User",
      resolve: (_, args, ctx) => ctx.prisma.users()
    });

    t.field("currentUser", {
      type: "User",
      args: { email: stringArg() },
      resolve: (_, { email }, ctx) => {
        const prisma: Prisma = ctx.prisma;
        return ctx.user;
      }
    });

    t.list.field("slots", {
      type: "Slot",
      resolve: (_, args, ctx) => ctx.prisma.slots()
    });
  }
});

const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.prismaFields(["createUser"]);
  }
});

const schema = makePrismaSchema({
  types: [Query, Mutation],

  prisma: {
    datamodelInfo,
    client: prisma
  },

  outputs: {
    schema: path.join(__dirname, "./generated/schema.graphql"),
    typegen: path.join(__dirname, "./generated/nexus.ts")
  }
});

const server = new GraphQLServer({
  schema,
  context: req => ({ prisma, ...req }),
  middlewares: [fetchUser]
});

server.start(
  {
    formatError: error => {
      console.warn(error);
      return error;
    },
    formatResponse: (response, query) => {
      console.info("GraphQL query and variables", {
        query: query.queryString,
        vars: query.variables
      });
      return response;
    }
  },
  () => console.log("Server is running on http://localhost:4000")
);
