const PRODUCTION = process.env.NODE_ENV === "production"

require("sharp") // image library sharp seems to crash without this require
require("dotenv-safe").config({
  allowEmptyValues: PRODUCTION,
})
if (PRODUCTION && !process.env.NEXUS_REFLECTION) {
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    require("newrelic")
  } else {
    console.log("New Relic license key missing")
  }
}

import { wsListen } from "./wsServer"
import server from "./server"
import prisma from "./prisma"
import * as winston from "winston"
import knex from "./services/knex"
import { attachPrismaEvents } from "./util/prismaLogger"

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
    prisma, //: prismaClient,
    logger,
    knex,
  })

  attachPrismaEvents({ prisma, logger })
  /*prismaClient.on("query", (e) => {
    e.timestamp
    e.query
    e.params
    e.duration
    e.target
    console.log(e)
  })*/

  if (!process.env.NEXUS_REFLECTION) {
    app.listen(4000, () => {
      console.log("server running on port 4000")
    })
    wsListen()
  }
}

startApp()
