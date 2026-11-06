import { randomBytes } from "crypto"
import { Server } from "http"
import { AddressInfo } from "net"

import { GraphQLClient } from "graphql-request"
import { knex, Knex } from "knex"
import winston from "winston"

import type { ApolloServer } from "@apollo/server"

import {
  DATABASE_URL_WITHOUT_SCHEMA,
  DB_USER,
  DEBUG,
  EXTENSION_PATH,
} from "../config"
import { ServerContext } from "../context"
import { User } from "../generated/prisma"
import binPrisma, {
  createPrismaClient,
  type ExtendedPrismaClient,
} from "../prisma"
import server from "../server"
import { parseTimestampsAsUtc } from "../util/pgTimestamps"
import { fail } from "./util"

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
      debug: jest.fn(),
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

      serverInstance = await new Promise<Server>((resolve, reject) =>
        httpServer.listen(0, () => resolve(httpServer)).on("error", reject),
      )
      port = (serverInstance.address() as AddressInfo).port
      DEBUG && console.log(`got port ${port}`)

      return {
        port,
        client: new GraphQLClient(`http://localhost:${port}`, {
          headers: { "Apollo-Require-Preflight": "true" },
        }),
        prisma,
        knexClient,
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
        || ' RESTART IDENTITY CASCADE'
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
      schemaName = `test_${randomBytes(8).toString("hex")}`
      // Generate the pg connection string for the test schema
      const databaseURLObject = new URL(DATABASE_URL_WITHOUT_SCHEMA)
      databaseURLObject.searchParams.append("schema", schemaName)
      databaseURLObject.searchParams.set("connection_limit", "10")
      databaseUrl = databaseURLObject.href
      const databaseName = databaseURLObject.pathname.replace("/", "")

      DEBUG && console.log(`creating knex ${databaseUrl}`)
      parseTimestampsAsUtc()
      knexClient = knex({
        client: "pg",
        connection: databaseUrl,
        searchPath: [schemaName, EXTENSION_PATH],
        debug: DEBUG,
        pool: {
          min: 2,
          max: 10,
        },
      })

      DEBUG && console.log(`running migrations ${schemaName}`)
      try {
        await knexClient.raw(`CREATE DATABASE ${databaseName};`)
      } catch {
        // do nothing, test database probably exists
      }
      // Run the migrations to ensure our schema has the required structure
      await knexClient.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`)
      await knexClient.migrate.latest({
        schemaName,
        database: databaseUrl,
      })
      // Clear data that might have been inserted during the migrations
      await clean()
      // Construct a new Prisma Client connected to the generated Postgres schema
      DEBUG && console.log(`creating prisma ${databaseUrl}`)

      prisma = createPrismaClient({
        databaseUrl,
        searchPath: [schemaName, EXTENSION_PATH],
        connectionLimit: 10,
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
