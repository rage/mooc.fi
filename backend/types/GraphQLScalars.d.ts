import {
  DateTimeResolver,
  JSONObjectResolver,
  JSONResolver,
} from "graphql-scalars"
import { GraphQLDecimal } from "prisma-graphql-type-decimal"

export type GraphQLDecimal = typeof GraphQLDecimal
export type GraphQLDAteTime = typeof DateTimeResolver
export type GraphQLJSON = typeof JSONResolver
export type GraphQLJSONObject = typeof JSONObjectResolver
