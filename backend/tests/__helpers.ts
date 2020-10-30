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

type TestContext = {
  client: GraphQLClient
  prisma: PrismaClient
}

export function createTestContext(): TestContext {
  let ctx = {} as TestContext

  const graphqlCtx = graphqlTestContext()
  const prismaCtx = prismaTestContext()

  beforeEach(async () => {
    const client = await graphqlCtx.before()
    const prisma = await prismaCtx.before()
    Object.assign(ctx, {
      client,
      prisma,
    })
  })
  afterEach(async () => {
    await graphqlCtx.after()
    await prismaCtx.after()
  })
  return ctx
}

function graphqlTestContext() {
  let apolloInstance: ApolloServer | null = null
  let serverInstance: Server | null = null
  return {
    async before() {
      const port = await getPort({ port: makeRange(4001, 6000) })
      console.log(`creating test server on port ${port}`)
      serverInstance = express.listen({ port })
      apolloInstance = new ApolloServer({ schema })
      apolloInstance.applyMiddleware({ app: express })
      return new GraphQLClient(`http://localhost:${port}`, {
        headers: {
          authorization:
            "Bearer a19e04d586d0085ceaaa39b62e18be724e3799a1fe1721d600f8703efc58f753",
        },
      })
    },
    async after() {
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

  return {
    async before() {
      // Generate a unique schema identifier for this test context
      schemaName = `test_${nanoid()}`
      // Generate the pg connection string for the test schema
      databaseUrl = `postgres://prisma:prisma@localhost:5678/testing?schema=${schemaName}`
      // Set the required environment variable to contain the connection string
      // to our database test schema
      process.env.DATABASE_URL = databaseUrl

      const client = knex({
        client: "pg",
        connection: databaseUrl,
        debug: true,
      })
      await client.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`)
      await client.destroy()

      // Run the migrations to ensure our schema has the required structure
      execSync(`${knexBinary} migrate:up`, {
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
        },
      })
      // Construct a new Prisma Client connected to the generated Postgres schema
      prismaClient = new PrismaClient({
        datasources: { db: { url: databaseUrl } },
      })
      return prismaClient
    },
    async after() {
      // Drop the schema after the tests have completed
      /*const client = knex({
        client: "pg",
        connection: databaseUrl
      })
      await client.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`)
      await client.destroy()*/
      // Release the Prisma Client connection
      await prismaClient?.$disconnect()
    },
  }
}
