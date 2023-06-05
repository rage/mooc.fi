import { Server } from "http"

import getPort, { makeRange } from "get-port"
import { GraphQLClient } from "graphql-request"
import { knex, Knex } from "knex"
import { nanoid } from "nanoid"
import winston from "winston"

import type { ApolloServer } from "@apollo/server"
import { User } from "@prisma/client"

import { DATABASE_URL, DB_USER, DEBUG, EXTENSION_PATH } from "../config"
import { ServerContext } from "../context"
import binPrisma, {
  createPrismaClient,
  type ExtendedPrismaClient,
} from "../prisma"
import server from "../server"
import { fail } from "./util"

require("sharp") // ensure correct zlib thingy

// @ts-ignore: jest has no explicit fail anymore
global.fail = fail

export const logger = {
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
  createLogger: jest.fn().mockImplementation(function () {
    return {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    }
  }),
}

export type TestContext = {
  client: GraphQLClient
  prisma: ExtendedPrismaClient
  logger: winston.Logger
  knex: Knex
  user?: User
  version: number
  port: number
}

let version = 1

export function getTestContext(): TestContext {
  const testContext = {
    logger: logger.createLogger() as winston.Logger,
  } as TestContext

  const ctx = createTestContext(testContext)

  // beforeEach
  beforeAll(async () => {
    const { port, prisma, client, knexClient } = await ctx.before()

    Object.assign(testContext, {
      port,
      prisma,
      client,
      knex: knexClient,
      version,
    })
  })
  afterEach(async () => {
    await ctx.clean()
  })

  afterAll(async () => {
    await ctx.after()
    await binPrisma.$disconnect()
  })
  return testContext
}

const wait = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time))

function createTestContext(testContext: TestContext) {
  let apolloInstance: ApolloServer<ServerContext> | null = null
  let serverInstance: Server | null = null
  let port: number | null = null

  const prismaCtx = prismaTestContext()

  return {
    async before() {
      const { prisma, knexClient } = await prismaCtx.before()

      const { apolloServer, httpServer } = await server({
        prisma,
        knex: knexClient,
        logger: testContext.logger,
        extraContext: {
          version: version++,
        },
      })
      apolloInstance = apolloServer

      while (true) {
        try {
          port = await getPort({ port: makeRange(4001, 4999) })
          serverInstance = await new Promise((resolve) =>
            httpServer
              .listen(port, () => resolve(httpServer))
              .on("error", (err) => {
                throw err
              }),
          )
          DEBUG && console.log(`got port ${port}`)

          return {
            port,
            client: new GraphQLClient(`http://localhost:${port}`, {
              headers: { "Apollo-Require-Preflight": "true" },
            }),
            prisma,
            knexClient,
          }
        } catch {
          DEBUG && console.log("race condition on ports, waiting...")
          await wait(100)
        }
      }
    },
    async clean() {
      await prismaCtx.clean()
    },
    async after() {
      await prismaCtx.after()
      serverInstance?.close()
      await apolloInstance?.stop()
    },
  }
}

function prismaTestContext() {
  let schemaName = ""
  let databaseUrl = ""
  let prisma: null | ExtendedPrismaClient = null
  let knexClient: Knex | null = null

  const clean = async () => {
    await knexClient?.raw(`DO $$ BEGIN 
    EXECUTE(
      SELECT 'TRUNCATE TABLE ' 
        || string_agg(format('%I.%I', schemaname, tablename), ', ') 
        || ' CASCADE' 
      FROM pg_tables 
      WHERE schemaname = '${schemaName}'
      AND tableowner = '${DB_USER}'
    ); 
  END $$;
  `)
  }
  return {
    async before() {
      // Generate a unique schema identifier for this test context
      schemaName = `test_${nanoid()}`
      // Generate the pg connection string for the test schema
      databaseUrl = `${DATABASE_URL}?schema=${schemaName}`

      DEBUG && console.log(`creating knex ${databaseUrl}`)
      knexClient = knex({
        client: "pg",
        connection: databaseUrl,
        debug: DEBUG,
      })

      DEBUG && console.log(`running migrations ${schemaName}`)
      // Run the migrations to ensure our schema has the required structure
      await knexClient.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`)
      await knexClient.raw(
        `SET SEARCH_PATH TO "${schemaName}","${EXTENSION_PATH}";`,
      )
      await knexClient.migrate.latest({
        schemaName,
        database: databaseUrl,
      })
      // Clear data that might have been inserted during the migrations
      await clean()
      // Construct a new Prisma Client connected to the generated Postgres schema
      DEBUG && console.log(`creating prisma ${databaseUrl}`)

      prisma = createPrismaClient({
        datasources: { db: { url: databaseUrl } },
      })

      return {
        knexClient,
        prisma,
      }
    },
    clean,
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

export * from "./util"
