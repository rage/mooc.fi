import { Prisma, PrismaClient } from "@prisma/client"

import { DATABASE_URL, isDev } from "../config"
import { logDefinition } from "../util/prismaLogger"
import { applyExtensions } from "./extensions"

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof createPrismaClient>
}

let prisma: ReturnType<typeof createPrismaClient>

export const createPrismaClient = (args?: Prisma.PrismaClientOptions) => {
  const initialPrisma = new PrismaClient({
    log: logDefinition,
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
    ...args,
  })

  const extendedPrisma = applyExtensions(initialPrisma)

  return extendedPrisma
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
export default prisma
