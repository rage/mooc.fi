import { prisma, Prisma, Int, User } from "./generated/prisma-client";
import datamodelInfo from "./generated/nexus-prisma";
import * as path from "path";
import { stringArg, idArg, convertSDL } from "nexus";
import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
import { GraphQLServer } from "graphql-yoga";
import { AuthenticationError, ForbiddenError } from "apollo-server-core";
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
    t.field("chooseSlot", {
      type: "User",
      args: {
        id: idArg()
      },
      resolve: async (_, { id }, ctx) => {
        const prisma: Prisma = ctx.prisma;
        console.log("slot id", id)
        const slot = await prisma.slot({ id });
        console.log("lolled")
        if (slot.registered_count >= slot.capacity) {
          throw new ForbiddenError("The slot is already full");
        }
        return prisma.updateUser({
          where: { id: ctx.user.id },
          data: {
            slot: { connect: { id: slot.id } }
          }
        });
      }
    });
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
