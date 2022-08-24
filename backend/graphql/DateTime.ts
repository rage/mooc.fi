import { DateTimeResolver } from "graphql-scalars"
import { scalarType } from "nexus"

export const DateTime = scalarType({
  ...DateTimeResolver.toConfig(),
  asNexusMethod: "datetime",
})
