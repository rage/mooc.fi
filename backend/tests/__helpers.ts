import { PrismaClient } from "@prisma/client"
import { Server } from "http"
import { execSync } from "child_process"
import getPort, { makeRange } from "get-port"
import { GraphQLClient } from "graphql-request"
import { nanoid } from "nanoid"
import { join } from "path"
import knex from "knex"
import server from "../server"
import type { ApolloServer } from "apollo-server-express"
import winston from "winston"

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

  beforeEach(async () => {
    const { prisma, client } = await ctx.before()

    Object.assign(testContext, {
      prisma,
      client,
    })
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
      const { prisma } = await prismaCtx.before()

      const { apollo, express } = server({
        prisma,
        logger: logger.createLogger(),
        extraContext: {
          version: version++,
        },
      })
      apolloInstance = apollo
      serverInstance = express.listen(port)

      return {
        client: new GraphQLClient(`http://localhost:${port}`),
        prisma,
      }
    },
    async after() {
      await prismaCtx.after()
      serverInstance?.close()
      await apolloInstance?.stop()
    },
  }
}

function systemSync(cmd: string, options: any = {}) {
  try {
    return execSync(cmd, options)
  } catch (e) {
    e.status
    e.message
    e.stderr
    e.stdout
    process.exit(1)
  }
}

function prismaTestContext() {
  const knexBinary = join(__dirname, "..", "node_modules", ".bin", "knex")

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
      process.env.DATABASE_URL = databaseUrl

      knexClient = knex({
        client: "pg",
        connection: databaseUrl,
        // debug: true,
      })
      await knexClient.transaction(async (trx: knex.Transaction) => {
        await trx.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`)
        await trx.raw(`SET SEARCH_PATH TO "${schemaName}";`)
        await trx.raw(
          `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "${schemaName}";`,
        )
      })

      // Run the migrations to ensure our schema has the required structure
      systemSync(`${knexBinary} migrate:latest`, {
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
          SEARCH_PATH: schemaName,
        },
        stdio: "inherit",
      })
      // Construct a new Prisma Client connected to the generated Postgres schema
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
      await knexClient?.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`)
      await knexClient?.destroy()
      // Release the Prisma Client connection
      await prisma?.$disconnect()
    },
  }
}
