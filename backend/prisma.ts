import { logDefinition } from "./util/prismaLogger"
import { PrismaClient } from "@prisma/client"

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
