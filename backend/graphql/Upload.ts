import { GraphQLUpload, FileUpload } from "graphql-upload"
import { scalarType } from "nexus"

export type UploadRoot = Promise<FileUpload>

export const Upload = scalarType({
  ...GraphQLUpload!,
  rootTyping: "UploadRoot",
})
