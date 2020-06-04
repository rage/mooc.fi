require("sharp") // even if this doesn't use sharp, we crash without it

// import { PrismaClient } from "@prisma/client"
// import { prisma } from "./generated/prisma-client"
// import datamodelInfo from "./generated/nexus-prisma"
import * as path from "path"
import { makeSchema } from "@nexus/schema"
import { nexusPrismaPlugin } from "nexus-prisma"
//import { makePrismaSchema } from "nexus-prisma"
import * as types from "./types"

console.log("types", types)
const schema = makeSchema({
  types,

  plugins: [nexusPrismaPlugin()],

  outputs: {
    schema: path.join(__dirname, "./generated/schema.graphql"),
    typegen: path.join(__dirname, "./generated/nexus.ts"),
  },

  typegenAutoConfig: {
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma",
      },
      {
        source: path.join(__dirname, "./context.ts"),
        alias: "ctx",
      },
    ],
    contextType: "ctx.Context",
  },
})

console.log(schema)
