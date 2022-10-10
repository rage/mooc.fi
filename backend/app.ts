import * as winston from "winston"

import { isProduction, NEW_RELIC_LICENSE_KEY, NEXUS_REFLECTION } from "./config"
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

const startApp = async () => {
  const { app } = await server({
    prisma,
    logger,
    knex,
  })

  attachPrismaEvents({ prisma, logger })

  if (!NEXUS_REFLECTION) {
    app.listen(4000, () => {
      console.log("server running on port 4000")
    })
    wsListen()
  }
}

startApp()
