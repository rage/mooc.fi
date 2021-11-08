import type { ApolloServer } from "apollo-server-express"
import getPort, { makeRange } from "get-port"
import { GraphQLClient } from "graphql-request"
import { Server } from "http"
import { knex, Knex } from "knex"
import { nanoid } from "nanoid"
import winston from "winston"

import { PrismaClient, User } from "@prisma/client"

import binPrisma from "../prisma"
import server from "../server"

require("sharp") // ensure correct zlib thingy
require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

const DEBUG = Boolean(process.env.DEBUG)

function fail(reason = "fail was called in a test") {
  throw new Error(reason)
}

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
  knex: Knex
  user?: User
  version: number
  port: number
}
let version = 1

export function getTestContext(): TestContext {
  let testContext = ({
    logger: logger.createLogger() as winston.Logger,
  } as unknown) as TestContext

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
  let apolloInstance: ApolloServer | null = null
  let serverInstance: Server | null = null
  let port: number | null = null

  const prismaCtx = createPrismaTestContext()

  return {
    async before() {
      const { prisma, knexClient } = await prismaCtx.before()

      const { apollo, app } = await server({
        prisma,
        knex: knexClient,
        logger: testContext.logger,
        extraContext: {
          version: version++,
        },
      })
      apolloInstance = apollo

      while (true) {
        try {
          port = await getPort({ port: makeRange(4001, 6000) })
          try {
            serverInstance = app.listen(port)
          } catch {
            throw new Error("port in use")
          }
          DEBUG && console.log(`got port ${port}`)

          return {
            port,
            client: new GraphQLClient(`http://localhost:${port}`),
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

function createPrismaTestContext() {
  // const knexBinary = join(__dirname, "..", "node_modules", ".bin", "knex")

  let schemaName = ""
  let databaseUrl = ""
  let prisma: null | PrismaClient = null
  let knexClient: Knex | null = null

  return {
    async before() {
      // Generate a unique schema identifier for this test context
      schemaName = `test_${nanoid()}`
      // Generate the pg connection string for the test schema
      databaseUrl = `postgres://prisma:prisma@localhost:5678/testing?schema=${schemaName}`
      // Set the required environment variable to contain the connection string
      // to our database test schema
      // process.env.DATABASE_URL = databaseUrl

      DEBUG && console.log(`creating knex ${databaseUrl}`)
      knexClient = knex({
        client: "pg",
        connection: databaseUrl,
        debug: DEBUG,
      })

      DEBUG && console.log(`running migrations ${schemaName}`)
      // Run the migrations to ensure our schema has the required structure
      await knexClient.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`)
      await knexClient.raw(`SET SEARCH_PATH TO "${schemaName}";`)
      //await knexClient.raw(
      //  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "${schemaName}";`,
      //)
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
    async clean() {
      await knexClient?.raw(`DO $$ BEGIN 
        EXECUTE(
          SELECT 'TRUNCATE TABLE ' 
            || string_agg(format('%I.%I', schemaname, tablename), ', ') 
            || ' CASCADE' 
          FROM pg_tables 
          WHERE schemaname = '${schemaName}'
          AND tableowner = 'prisma'
        ); 
      END $$;
      `)
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

export * from "./util"
