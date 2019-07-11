import { GraphQLUpload } from "graphql-upload"
import { asNexusMethod } from "nexus"

const Upload = asNexusMethod(GraphQLUpload, "upload")

export default Upload
