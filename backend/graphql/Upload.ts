import { GraphQLUpload, FileUpload } from "graphql-upload"
import { scalarType } from "nexus"

export type UploadRoot = Promise<FileUpload>

export const Upload = scalarType({
  ...GraphQLUpload!,
  rootTyping: "UploadRoot",
  /*name: GraphQLUpload.name,
  asNexusMethod: "upload",
  description: GraphQLUpload.description,
  serialize: GraphQLUpload.serialize,
  parseValue: GraphQLUpload.parseValue,
  parseLiteral: GraphQLUpload.parseLiteral,*/
})
