import { prisma, Prisma, Int, User } from "./generated/prisma-client";
import datamodelInfo from "./generated/nexus-prisma";
import * as path from "path";
import { stringArg, idArg, convertSDL, subscriptionField } from "nexus";
import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
import { GraphQLServer } from "graphql-yoga";
import { AuthenticationError, ForbiddenError } from "apollo-server-core";
import TmcClient from "./services/tmc";
import fetchUser from "./middlewares/FetchUser";
import { wordCount } from "../util/strings";
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

    t.list.field("essayTopics", {
      type: "EssayTopic",
      resolve: (_, args, ctx) => ctx.prisma.essayTopics()
    });

    t.field("ownEssay", {
      type: "Essay",
      args: {
        id: idArg()
      },

      resolve: async (o, { id }, ctx) => {
        const prisma: Prisma = ctx.prisma;
        return await prisma.essay({ id });
      }
    });
  }
});

const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.field("chooseSlot", {
      type: "User",
      args: {
        id: idArg()
      },
      resolve: async (_, { id }, ctx) => {
        const prisma: Prisma = ctx.prisma;
        const slot = await prisma.slot({ id });
        const registered_count = await prisma
          .usersConnection({
            where: { slot: { id: id } }
          })
          .aggregate()
          .count();

        console.log(ctx.user);
        if (registered_count >= slot.capacity) {
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

    t.field("saveEssay", {
      type: "EssayTopic",
      args: {
        topicId: idArg(),
        text: stringArg()
      },
      resolve: async (_, { topicId, text }, ctx) => {
        const prisma: Prisma = ctx.prisma;
        const topic = await prisma.essayTopic({ id: topicId });
        const words = wordCount(text);
        if (words < topic.min_words || words > topic.max_words) {
          throw new ForbiddenError(
            "Text word count is not within given limits."
          );
        }
        const previousAnswer = (await prisma.essays({
          where: { author: { id: ctx.user.id }, topic: { id: topicId } },
          orderBy: "createdAt_DESC",
          first: 1
        }))[0];
        if (!previousAnswer) {
          await prisma.createEssay({
            author: { connect: { id: ctx.user.id } },
            topic: {
              connect: {
                id: topicId
              }
            },
            text
          });
        } else {
          await prisma.updateEssay({
            data: { text },
            where: { id: previousAnswer.id }
          });
        }

        return prisma.essayTopic({ id: topicId });
      }
    });
  }
});

const EssayTopic = prismaObjectType({
  name: "EssayTopic",
  definition(t) {
    t.prismaFields(["*"]);
    t.field("currentUserAnswer", {
      type: "Essay",
      nullable: true,
      resolve: async (parent, args, ctx) => {
        const prisma: Prisma = ctx.prisma;
        const essay = await prisma.essays({
          where: { author: { id: ctx.user.id }, topic: { id: parent.id } },
          orderBy: "createdAt_DESC",
          first: 1
        });
        return essay[0];
      }
    });
  }
});

const Slots = prismaObjectType({
  name: "Slot",
  definition(t) {
    t.prismaFields(["*"]);
    t.field("registered_count", {
      type: "Int",
      resolve: async (parent, args, ctx) => {
        const prisma: Prisma = ctx.prisma;
        const userAggrecatePromise = prisma
          .usersConnection({ where: { slot: { id: parent.id } } })
          .aggregate();

        return userAggrecatePromise.count();
      }
    });
  }
});

const schema = makePrismaSchema({
  types: [Query, Mutation, EssayTopic, Slots],

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
