import {
  DateResolver,
  DateTimeResolver,
  JSONObjectResolver,
  JSONResolver,
} from "graphql-scalars"
import { GraphQLDecimal } from "prisma-graphql-type-decimal"

export type GraphQLDate = typeof DateResolver
export type GraphQLDecimal = typeof GraphQLDecimal
export type GraphQLDateTime = typeof DateTimeResolver
export type GraphQLJSON = typeof JSONResolver
export type GraphQLJSONObject = typeof JSONObjectResolver
