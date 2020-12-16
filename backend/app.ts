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
import { PrismaClient } from "@prisma/client"
import * as winston from "winston"
import knex from "./services/knex"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "backend" },
  transports: [new winston.transports.Console()],
})

const prismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
})

const { express } = server({
  prisma: prismaClient,
  logger,
  knex,
})

/*prismaClient.on("query", (e) => {
  e.timestamp
  e.query
  e.params
  e.duration
  e.target
  console.log(e)
})*/

if (!process.env.NEXUS_REFLECTION) {
  express.listen(4000, () => {
    console.log("server running on port 4000")
  })
  wsListen()
}
