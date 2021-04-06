import { PrismaClient } from "@prisma/client"
import { logDefinition } from "./util/prismaLogger"

let _prisma: PrismaClient

const prismaClient = () => {
  if (!_prisma) {
    _prisma = new PrismaClient({
      log: logDefinition,
    })
  }

  return _prisma
}

export default prismaClient()
