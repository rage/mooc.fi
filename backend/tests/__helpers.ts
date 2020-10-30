import { PrismaClient } from "@prisma/client"
import { Server } from "http"
import { execSync } from "child_process"
import getPort, { makeRange } from "get-port"
import { GraphQLClient } from "graphql-request"
import { nanoid } from "nanoid"
import { join } from "path"
import knex from "knex"
import express from "../server"
import { ApolloServer } from "apollo-server-express"
import { schema } from "../schema"
import winston from "winston"

const logger = {
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

type TestContext = {
  client: GraphQLClient
  prisma: PrismaClient
  logger: winston.Logger
}

export function getTestContext(): TestContext {
  let testContext = {
    logger: logger as any,
  } as TestContext

  const ctx = createTestContext()
  let knexClient: knex | null = null

  beforeEach(async () => {
    const { prisma, client, knexClient: _knexClient } = await ctx.before()

    Object.assign(testContext, {
      prisma,
      client,
    })

    knexClient = _knexClient
  })
  afterEach(async () => {
    await ctx.after()
  })
  return testContext
}

function createTestContext() {
  let apolloInstance: ApolloServer | null = null
  let serverInstance: Server | null = null

  const prismaCtx = prismaTestContext()

  return {
    async before() {
      const port = await getPort({ port: makeRange(4001, 6000) })
      const { knexClient, prisma } = await prismaCtx.before()

      apolloInstance = new ApolloServer({
        schema,
        context: (ctx) => ({
          ...ctx,
          prisma,
          logger,
        }),
      })
      apolloInstance.applyMiddleware({ app: express, path: "/" })
      serverInstance = express.listen(port)

      return {
        client: new GraphQLClient(`http://localhost:${port}`, {
          /*headers: {
            authorization:
              "Bearer a19e04d586d0085ceaaa39b62e18be724e3799a1fe1721d600f8703efc58f753",
          },*/
        }),
        prisma,
        knexClient,
      }
    },
    async after() {
      await prismaCtx.after()
      serverInstance?.close()
      apolloInstance?.stop()
    },
  }
}

function prismaTestContext() {
  // const prismaBinary = join(__dirname, "..", "node_modules", ".bin", "prisma")
  const knexBinary = join(__dirname, "..", "node_modules", ".bin", "knex")

  let schemaName = ""
  let databaseUrl = ""
  let prismaClient: null | PrismaClient = null
  let knexClient: knex | null = null

  return {
    async before() {
      // Generate a unique schema identifier for this test context
      schemaName = `test_${nanoid()}`
      // Generate the pg connection string for the test schema
      databaseUrl = `postgres://prisma:prisma@localhost:5678/testing?schema=${schemaName}`
      // Set the required environment variable to contain the connection string
      // to our database test schema
      process.env.DATABASE_URL = databaseUrl

      knexClient = knex({
        client: "pg",
        connection: databaseUrl,
        // debug: true,
      })
      await knexClient.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`)
      await knexClient.raw(`SET SEARCH_PATH TO "${schemaName}";`)
      await knexClient.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)

      // Run the migrations to ensure our schema has the required structure
      execSync(`${knexBinary} migrate:latest`, {
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
          SEARCH_PATH: schemaName,
        },
        stdio: "inherit",
      })
      // Construct a new Prisma Client connected to the generated Postgres schema
      prismaClient = new PrismaClient({
        datasources: { db: { url: databaseUrl } },
      })
      return {
        knexClient,
        prisma: prismaClient,
      }
    },
    async after() {
      // Drop the schema after the tests have completed
      await knexClient?.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`)
      await knexClient?.destroy()
      // Release the Prisma Client connection
      await prismaClient?.$disconnect()
    },
  }
}
