import { Prisma, User } from "./generated/prisma-client"

export interface Context {
  prisma: Prisma
  user: User
  disableRelations: boolean | undefined
}
