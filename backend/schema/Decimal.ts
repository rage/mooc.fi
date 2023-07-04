import { scalarType } from "nexus"
import { GraphQLDecimal } from "prisma-graphql-type-decimal"

export const Decimal = scalarType({
  ...GraphQLDecimal.toConfig(),
  sourceType: "scalars.GraphQLDecimal",
  asNexusMethod: "decimal",
})
