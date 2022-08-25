import { Knex } from "knex"
import * as winston from "winston"

import { PrismaClient } from "@prisma/client"

export type TemplateContext = {
  prisma: PrismaClient
  logger?: winston.Logger
  knex?: Knex
  test?: boolean
}
