import { prisma, Prisma, Int, User } from "./generated/prisma-client";
import datamodelInfo from "./generated/nexus-prisma";
import * as path from "path";
import { stringArg, idArg, convertSDL, subscriptionField } from "nexus";
import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
import { GraphQLServer } from "graphql-yoga";
import { AuthenticationError, ForbiddenError } from "apollo-server-core";
import TmcClient from "./services/tmc";
import fetchUser from "./middlewares/FetchUser";



import * as winston from "winston";

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
  }
});

const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {

  }
});

const schema = makePrismaSchema({
  types: [Query],

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
