import { Prisma, PrismaClient } from "@prisma/client"

import { isDev } from "../config"
import { logDefinition } from "../util/prismaLogger"
import * as Extensions from "./extensions"

export const createPrismaClient = (args?: Prisma.PrismaClientOptions) => {
  const initialPrisma = new PrismaClient({
    log: logDefinition,
    ...args,
  })

  return initialPrisma
    .$extends(Extensions.findManyPagination)
    .$extends(Extensions.courseFindUniqueOrAlias)
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

export type ExtendedPrismaClient = typeof prisma
export default prisma
