import { prismaObjectType } from "nexus-prisma"

const Course = prismaObjectType<"Course">({
  name: "Course",
  definition(t) {
    t.prismaFields(["*"])
    t.field("description", { type: "String" })
    t.field("link", { type: "String" })
  },
})

export default Course
