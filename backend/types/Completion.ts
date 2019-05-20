import { prismaObjectType } from "nexus-prisma";
import * as resolvers from "../resolvers/Completion"

const Completion = prismaObjectType({
    name: "Completion",
    definition(t) {
      t.prismaFields(["id", "createdAt", "updatedAt", "course", "completion_language", "email",
        "student_number", "user_upstream_id"])
  
      t.field("user", {
        type: "User",
        resolve: (parent, args, ctx) => resolvers.Completion(parent, args, ctx)
      })
  
    }
  })
export default Completion