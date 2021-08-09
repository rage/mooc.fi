import { User, Organization } from "@prisma/client"
import { Role } from "./accessControl"
import { UserInfo } from "./domain/UserInfo"
import TmcClient from "./services/tmc"
import { PrismaClient } from "@prisma/client"
import { IncomingMessage } from "http"
import type { Logger } from "winston"
import { Knex } from "knex"

export type Context = {
  prisma: PrismaClient
  user?: Omit<User, "password" | "password_throttle">
  organization?: Organization
  disableRelations: boolean
  role?: Role | undefined
  userDetails?: UserInfo | undefined
  tmcClient: TmcClient | undefined
  req: IncomingMessage
  logger: Logger
  knex: Knex
}
