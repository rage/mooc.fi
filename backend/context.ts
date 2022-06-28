import { IncomingMessage } from "http"

import { Organization, User } from "@prisma/client"
import { PrismaClient } from "@prisma/client"
import { Knex } from "knex"
import type { Logger } from "winston"

import { Role } from "./accessControl"
import { UserInfo } from "./domain/UserInfo"
import TmcClient from "./services/tmc"

export type Context = {
  prisma: PrismaClient
  user?: User
  organization?: Organization
  disableRelations: boolean
  role?: Role | undefined
  userDetails?: UserInfo | undefined
  tmcClient: TmcClient | undefined
  req: IncomingMessage
  logger: Logger
  knex: Knex
}
