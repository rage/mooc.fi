import { makeSchema, connectionPlugin } from "@nexus/schema"
import { nexusPrismaPlugin } from "nexus-prisma"
import * as types from "../types"
import { PrismaClient, user, organization } from "@prisma/client"
import { Role } from "../accessControl"
import { UserInfo } from "/domain/UserInfo"
import TmcClient from "../services/tmc"
import { Response as ExpressResponse } from "express-serve-static-core"
import * as path from "path"

export type Context = {
  prisma: PrismaClient
  user: user | undefined
  organization: organization | undefined
  disableRelations: boolean | undefined
  role: Role | undefined
  userDetails: UserInfo | undefined
  tmcClient: TmcClient | undefined
  response: ExpressResponse
}

export const schema = makeSchema({
  shouldGenerateArtifacts: true,
  types: [types],
  plugins: [
    nexusPrismaPlugin(),
    connectionPlugin({
      includeNodesField: true,
      disableBackwardPagination: true,
    }),
  ],
  typegenAutoConfig: {
    contextType: "ctx.Context",
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma",
      },
      {
        source: require.resolve("."),
        alias: "ctx",
      },
    ],
  },
  outputs: {
    schema: path.join(__dirname, "../generated/schema.graphql"),
    typegen: path.join(__dirname, "../generated/nexus.ts"),
  },
})
