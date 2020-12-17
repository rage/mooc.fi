require("sharp") // ensure correct zlib thingy

import { PrismaClient, User } from "@prisma/client"
import { Server } from "http"
import getPort, { makeRange } from "get-port"
import { GraphQLClient } from "graphql-request"
import { nanoid } from "nanoid"
import knex from "knex"
import server from "../server"
import type { ApolloServer } from "apollo-server-express"
import winston from "winston"
import nock from "nock"
import binPrisma from "../bin/lib/prisma"

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
  port: number
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

  // beforeEach
  beforeAll(async (done) => {
    const { port, prisma, client, knexClient } = await ctx.before()

    Object.assign(testContext, {
      port,
      prisma,
      client,
      knexClient,
      version,
    })
    done()
  })
  afterEach(async (done) => {
    await ctx.clean()
    done()
  })

  afterAll(async (done) => {
    await ctx.after()
    await binPrisma.$disconnect()
    done()
  })
  return testContext
}

const wait = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time))

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
        knexClient,
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

          return {
            port,
            client: new GraphQLClient(`http://localhost:${port}`),
            prisma,
            knexClient,
          }
        } catch {
          DEBUG && console.log("race condition on ports, waiting...")
          await wait(50)
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

type FakeTMCRecord = Record<string, [number, object]>

export function fakeTMC(
  users: FakeTMCRecord,
  url = "/api/v8/users/current?show_user_fields=1&extra_fields=1",
) {
  return {
    setup() {
      nock(process.env.TMC_HOST || "")
        .persist()
        .get(url)
        .reply(function () {
          const auth = this.req.headers.authorization

          return users[auth]
        })
    },
    teardown() {
      nock.cleanAll()
    },
  }
}
