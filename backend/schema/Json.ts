import { JSONObjectResolver, JSONResolver } from "graphql-scalars"
import { scalarType } from "nexus"

export const Json = scalarType({
  ...JSONResolver.toConfig(),
  name: "JSON",
  sourceType: "PrismaClient.Prisma.JsonValue",
  asNexusMethod: "json",
})

export const JSONObject = scalarType({
  ...JSONObjectResolver.toConfig(),
  sourceType: "PrismaClient.Prisma.JsonObject",
  asNexusMethod: "jsonObject",
})
