import { PrismaClient } from "@prisma/client"

import { isDev } from "./config"
import { logDefinition } from "./util/prismaLogger"

interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient
}
declare const global: CustomNodeJsGlobal

const prisma =
  global.prisma ||
  new PrismaClient({
    log: logDefinition,
  })

if (isDev) {
  global.prisma = prisma
}

export default prisma
