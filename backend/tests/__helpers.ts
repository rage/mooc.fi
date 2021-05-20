require("sharp") // ensure correct zlib thingy

import { PrismaClient, User } from "@prisma/client"
import { Server } from "http"
import getPort, { makeRange } from "get-port"
import { GraphQLClient } from "graphql-request"
import { nanoid } from "nanoid"
import { knex, Knex } from "knex"
import server from "../server"
import type { ApolloServer } from "apollo-server-express"
import winston from "winston"
import nock from "nock"
import binPrisma from "../prisma"

const DEBUG = Boolean(process.env.DEBUG)

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
  let testContext = {
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
  let apolloInstance: ApolloServer | null = null
  let serverInstance: Server | null = null
  let port: number | null = null

  const prismaCtx = prismaTestContext()

  return {
    async before() {
      const { prisma, knexClient } = await prismaCtx.before()

      const { apollo, app } = server({
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

function prismaTestContext() {
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

type FakeTMCRecord = Record<string, [number, object]>

export function fakeTMCCurrent(
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

export function fakeTMCSpecific(users: Record<number, [number, object]>) {
  return {
    setup() {
      for (const [user_id, reply] of Object.entries(users)) {
        nock(process.env.TMC_HOST || "")
          .persist()
          .get(`/api/v8/users/${user_id}?show_user_fields=1&extra_fields=1`)
          .reply(function () {
            return reply
          })
      }
    },
    teardown() {
      nock.cleanAll()
    },
  }
}

export const fakeGetAccessToken = (reply: [number, string]) =>
  nock(process.env.TMC_HOST || "")
    .post("/oauth/token")
    .reply(() => [reply[0], { access_token: reply[1] }])

export const fakeUserDetailReply = (reply: [number, object]) =>
  nock(process.env.TMC_HOST || "")
    .get("/api/v8/users/recently_changed_user_details")
    .reply(reply[0], () => reply[1])

export const fakeTMCUserCreate = (reply: [number, object]) =>
  nock(process.env.TMC_HOST || "")
    .post("/api/v8/users")
    .reply(() => [reply[0], reply[1]])

export const fakeTMCUserEmailNotFound = (reply: [number, object]) =>
  nock(process.env.TMC_HOST || "")
    .post(
      "/oauth/token",
      JSON.stringify({
        username: "incorrect-email@user.com",
        password: "password",
        grant_type: "password",
        client_id:
          "59a09eef080463f90f8c2f29fbf63014167d13580e1de3562e57b9e6e4515182",
        client_secret:
          "2ddf92a15a31f87c1aabb712b7cfd1b88f3465465ec475811ccce6febb1bad28",
      }),
    )
    .reply(() => [reply[0], reply[1]])

export const fakeTMCUserWrongPassword = (reply: [number, object]) =>
  nock(process.env.TMC_HOST || "")
    .post(
      "/oauth/token",
      JSON.stringify({
        username: "e@mail.com",
        password: "incorrect-password",
        grant_type: "password",
        client_id:
          "59a09eef080463f90f8c2f29fbf63014167d13580e1de3562e57b9e6e4515182",
        client_secret:
          "2ddf92a15a31f87c1aabb712b7cfd1b88f3465465ec475811ccce6febb1bad28",
      }),
    )
    .reply(() => [reply[0], reply[1]])
