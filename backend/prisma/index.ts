import { PrismaPg } from "@prisma/adapter-pg"

import {
  CONNECTION_LIMIT,
  DATABASE_URL_WITHOUT_SCHEMA,
  isDev,
  SEARCH_PATH,
} from "../config"
import { PrismaClient } from "../generated/prisma"
import { logDefinition } from "../util/prismaLogger"
import { applyExtensions } from "./extensions"

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof createPrismaClient>
}

let prisma: ReturnType<typeof createPrismaClient>

interface PrismaConnectionOptions {
  /** Postgres URL; Prisma-only query parameters (`schema`, `connection_limit`) are ignored. */
  databaseUrl?: string
  /** Schemas for `search_path`; the first one is the schema Prisma's generated queries target. */
  searchPath?: Array<string>
  connectionLimit?: number
}

const quoteIdentifier = (identifier: string) =>
  `"${identifier.replaceAll('"', '""')}"`

/**
 * Creates the extended Prisma client used by the app, bin scripts and tests.
 *
 * Defaults to the connection settings in `config.ts`; tests override them to point at a
 * per-suite schema.
 */
export const createPrismaClient = ({
  databaseUrl = DATABASE_URL_WITHOUT_SCHEMA,
  searchPath = SEARCH_PATH,
  connectionLimit = Number(CONNECTION_LIMIT) || undefined,
}: PrismaConnectionOptions = {}) => {
  const url = new URL(databaseUrl)
  url.searchParams.delete("schema")
  url.searchParams.delete("connection_limit")

  const adapter = new PrismaPg(
    {
      connectionString: url.href,
      max: connectionLimit,
      // pg's default is to wait forever.
      connectionTimeoutMillis: 5_000,
      // Raw queries use unqualified table names, so they need the search path too.
      options: `-c search_path=${searchPath.map(quoteIdentifier).join(",")}`,
    },
    { schema: searchPath[0] },
  )

  const initialPrisma = new PrismaClient({
    log: logDefinition,
    adapter,
  })

  return applyExtensions(initialPrisma)
}

if (global.prisma) {
  prisma = global.prisma
} else {
  prisma = createPrismaClient()
}

if (isDev) {
  global.prisma = prisma
}

export type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>
export type ExtendedTransactionClient = Omit<
  ExtendedPrismaClient,
  "$extends" | "$transaction" | "$disconnect" | "$connect" | "$on"
>

export default prisma
