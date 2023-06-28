import { Knex } from "knex"
import * as winston from "winston"

import { ExtendedPrismaClient } from "../../../../../prisma"

export type TemplateContext = {
  prisma: ExtendedPrismaClient
  logger?: winston.Logger
  knex?: Knex
  test?: boolean
}
