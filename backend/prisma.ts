import { PrismaClient } from "@prisma/client"

import { isDev } from "./config"
import { logDefinition } from "./util/prismaLogger"

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: logDefinition,
  })

if (isDev) {
  global.prisma = prisma
}

export default prisma
