import { PrismaClient } from "@prisma/client"

let _prisma: PrismaClient

const prismaClient = () => {
  if (!_prisma) {
    _prisma = new PrismaClient()
  }

  return _prisma
}

export default prismaClient()
