import { IncomingMessage } from "http"

import { Knex } from "knex"
import type { Logger } from "winston"

import { Organization, PrismaClient, User } from "@prisma/client"

import { Role } from "./accessControl"
import { UserInfo } from "./domain/UserInfo"
import TmcClient from "./services/tmc"

export interface BaseContext {
  prisma: PrismaClient
  logger: Logger
  knex: Knex
}

export interface Context extends BaseContext {
  user?: User
  organization?: Organization
  disableRelations: boolean
  role?: Role
  userDetails?: UserInfo
  tmcClient?: TmcClient
  req: IncomingMessage
}

export interface ServerContext extends BaseContext {
  extraContext?: Record<string, any>
}
