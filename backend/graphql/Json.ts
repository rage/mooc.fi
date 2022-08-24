import { JSONResolver } from "graphql-scalars"
import { scalarType } from "nexus"

export const Json = scalarType({
  ...JSONResolver.toConfig(),
  name: "Json",
  asNexusMethod: "json",
})
