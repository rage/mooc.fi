import { Prisma, User, Organization } from "./generated/prisma-client"
import { Role } from "./accessControl"
import { UserInfo } from "/domain/UserInfo"
import TmcClient from "./services/tmc"
import { Context as PrismaContext } from "prisma-client-lib/dist/types"

export interface Context extends PrismaContext {
  prisma: Prisma
  user: User | undefined
  organization: Organization | undefined
  disableRelations: boolean | undefined
  role: Role | undefined
  userDetails: UserInfo | undefined
  tmcClient: TmcClient | undefined
}
