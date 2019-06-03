import { Prisma, User, Organization } from "./generated/prisma-client"

export interface Context {
  prisma: Prisma
  user: User
  organization: Organization | undefined
  disableRelations: boolean | undefined
}
