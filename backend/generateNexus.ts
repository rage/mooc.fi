require("sharp") // even if this doesn't use sharp, we crash without it

import { prisma } from "./generated/prisma-client"
import datamodelInfo from "./generated/nexus-prisma"
import * as path from "path"
import { makePrismaSchema } from "nexus-prisma"
import * as types from "./types"

const schema = makePrismaSchema({
  types: [types],

  prisma: {
    datamodelInfo,
    client: prisma,
  },

  outputs: {
    schema: path.join(__dirname, "./generated/schema.graphql"),
    typegen: path.join(__dirname, "./generated/nexus.ts"),
  },

  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, "./context.ts"),
        alias: "ctx",
      },
    ],
    contextType: "ctx.Context",
  },
})

console.log(schema)
