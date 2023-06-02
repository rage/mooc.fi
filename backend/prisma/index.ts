import { Prisma, PrismaClient } from "@prisma/client"

import { isDev } from "../config"
import { logDefinition } from "../util/prismaLogger"
import { applyExtensions } from "./extensions"

export const createPrismaClient = (args?: Prisma.PrismaClientOptions) => {
  const initialPrisma = new PrismaClient({
    log: logDefinition,
    ...args,
  })

  return applyExtensions(initialPrisma)
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof createPrismaClient>
}

let prisma: ReturnType<typeof createPrismaClient>

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
