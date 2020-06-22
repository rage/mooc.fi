import { user, organization } from "@prisma/client"
import { Role } from "./accessControl"
import { UserInfo } from "/domain/UserInfo"
import TmcClient from "./services/tmc"
import { PrismaClient } from "@prisma/client"
import { IncomingHttpHeaders } from "http"

export interface NexusContext {
  db: PrismaClient
  user: user | undefined
  organization: organization | undefined
  disableRelations: boolean
  role: Role | undefined
  userDetails: UserInfo | undefined
  tmcClient: TmcClient | undefined
  headers: IncomingHttpHeaders
}
