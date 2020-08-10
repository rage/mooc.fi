import { GraphQLUpload } from "apollo-server-core"
import type { FileUpload } from "graphql-upload"
import { schema } from "nexus"

export type UploadRoot = Promise<FileUpload>

schema.scalarType({
  ...GraphQLUpload!,
  rootTyping: "UploadRoot",
  /*name: GraphQLUpload.name,
  asNexusMethod: "upload",
  description: GraphQLUpload.description,
  serialize: GraphQLUpload.serialize,
  parseValue: GraphQLUpload.parseValue,
  parseLiteral: GraphQLUpload.parseLiteral,*/
})
