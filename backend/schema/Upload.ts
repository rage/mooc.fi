import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs"
import { scalarType } from "nexus"

export const Upload = scalarType({
  ...GraphQLUpload.toConfig(),
  name: "Upload",
  sourceType: "Upload['promise']",
  asNexusMethod: "upload",
})
