import * as winston from "winston"

import { isProduction, NEW_RELIC_LICENSE_KEY, NEXUS_REFLECTION } from "./config"
import { ServerContext } from "./context"
import prisma from "./prisma"
import server from "./server"
import knex from "./services/knex"
import { attachPrismaEvents } from "./util"
import { wsListen } from "./wsServer"

require("sharp") // image library sharp seems to crash without this require

if (isProduction && !NEXUS_REFLECTION) {
  if (NEW_RELIC_LICENSE_KEY) {
    require("newrelic")
  } else {
    console.log("New Relic license key missing")
  }
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "backend" },
  transports: [new winston.transports.Console()],
})

const ctx: ServerContext = { prisma, logger, knex }

const startApp = async () => {
  const { httpServer } = await server(ctx)

  attachPrismaEvents(ctx)

  if (!NEXUS_REFLECTION) {
    await ctx.prisma.$connect()
    httpServer.listen(4000, () => {
      console.log("server running on port 4000")
    })

    wsListen()
  }
}

startApp().catch((e) => {
  logger.error(e)
  process.exit(1)
})
