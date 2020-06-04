import { GraphQLUpload } from "graphql-upload"
import { scalarType } from "@nexus/schema"

export const Upload = scalarType({
  name: GraphQLUpload.name,
  asNexusMethod: "upload",
  description: GraphQLUpload.description,
  serialize: GraphQLUpload.serialize,
  parseValue: GraphQLUpload.parseValue,
  parseLiteral: GraphQLUpload.parseLiteral,
})

export default Upload
