import { Prisma, User, Organization } from "./generated/prisma-client"
import { Role } from "./accessControl"

export interface Context {
  prisma: Prisma
  user: User | undefined
  organization: Organization | undefined
  disableRelations: boolean | undefined
  role: Role | undefined
}
