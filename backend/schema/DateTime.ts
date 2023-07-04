import { DateResolver, DateTimeResolver } from "graphql-scalars"
import { scalarType } from "nexus"

export const DateTime = scalarType({
  ...DateTimeResolver.toConfig(),
  sourceType: "Date",
  asNexusMethod: "datetime",
})

export const DateType = scalarType({
  ...DateResolver.toConfig(),
  name: "Date",
  sourceType: "Date",
  asNexusMethod: "date",
})
