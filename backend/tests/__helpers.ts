import { PrismaClient, User } from "@prisma/client"
import { Server } from "http"
import getPort, { makeRange } from "get-port"
import { GraphQLClient } from "graphql-request"
import { nanoid } from "nanoid"
import type knex from "knex"
import server from "../server"
import type { ApolloServer } from "apollo-server-express"
import winston from "winston"

const DEBUG = Boolean(process.env.DEBUG)

const logger = {
  format: {
    printf: jest.fn(),
    timestamp: jest.fn(),
    simple: jest.fn(),
    colorize: jest.fn(),
    combine: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
  createLogger: jest.fn().mockImplementation(function (_creationOpts) {
    return {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    }
  }),
}

export type TestContext = {
  client: GraphQLClient
  prisma: PrismaClient
  logger: winston.Logger
  knexClient: knex
  user?: User
  version: number
}

export type TestContextContainer = {
  ctx: TestContext
  setup: () => Promise<void>
  teardown: () => Promise<void>
}

let version = 1

export function getTestContext(): TestContext {
  let testContext = {
    logger: logger as any,
  } as TestContext

  const ctx = createTestContext()

  beforeEach(async (done) => {
    const { prisma, client, knexClient } = await ctx.before()

    Object.assign(testContext, {
      prisma,
      client,
      knexClient,
      version,
    })
    done()
  })
  afterEach(async () => {
    await ctx.after()
  })

  return testContext
}

function createTestContext() {
  let apolloInstance: ApolloServer | null = null
  let serverInstance: Server | null = null
  let port: number | null = null

  const prismaCtx = prismaTestContext()

  return {
    async before() {
      const { prisma, knexClient } = await prismaCtx.before()

      const { apollo, express } = server({
        prisma,
        logger: logger.createLogger(),
        extraContext: {
          version: version++,
        },
      })
      apolloInstance = apollo

      while (true) {
        try {
          port = await getPort({ port: makeRange(4001, 6000) })
          serverInstance = express.listen(port)
          DEBUG && console.log(`got port ${port}`)
          break
        } catch {
          DEBUG && console.log("race condition on ports, waiting...")
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }

      return {
        client: new GraphQLClient(`http://localhost:${port}`),
        prisma,
        knexClient,
      }
    },
    async after() {
      await prismaCtx.after()
      serverInstance?.close()
      await apolloInstance?.stop()
    },
  }
}

function prismaTestContext() {
  // const knexBinary = join(__dirname, "..", "node_modules", ".bin", "knex")

  let schemaName = ""
  let databaseUrl = ""
  let prisma: null | PrismaClient = null
  let knexClient: knex | null = null

  return {
    async before() {
      // Generate a unique schema identifier for this test context
      schemaName = `test_${nanoid()}`
      // Generate the pg connection string for the test schema
      databaseUrl = `postgres://postgres:postgres@localhost:5432/testing?schema=${schemaName}`
      // Set the required environment variable to contain the connection string
      // to our database test schema
      // process.env.DATABASE_URL = databaseUrl

      DEBUG && console.log(`creating knex ${databaseUrl}`)
      knexClient = require("knex")({
        client: "pg",
        connection: databaseUrl,
        debug: DEBUG,
      }) as knex

      DEBUG && console.log(`running migrations ${schemaName}`)
      // Run the migrations to ensure our schema has the required structure
      await knexClient.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`)
      await knexClient.raw(`SET SEARCH_PATH TO "${schemaName}";`)
      await knexClient.raw(
        `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "${schemaName}";`,
      )
      await knexClient.migrate.latest({
        schemaName,
        database: databaseUrl,
      })

      // Construct a new Prisma Client connected to the generated Postgres schema
      DEBUG && console.log(`creating prisma ${databaseUrl}`)
      prisma = new PrismaClient({
        datasources: { db: { url: databaseUrl } },
      })
      return {
        knexClient,
        prisma,
      }
    },
    async after() {
      // Drop the schema after the tests have completed
      DEBUG && console.log(`dropping schema ${schemaName}`)
      await knexClient?.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`)
      await knexClient?.destroy()
      // Release the Prisma Client connection
      await prisma?.$disconnect()
    },
  }
}