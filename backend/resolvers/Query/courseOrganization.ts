import { Prisma } from "../../generated/prisma-client"
import { idArg } from "@nexus/schema"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const courseOrganizations = async (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("courseOrganizations", {
    type: "CourseOrganization",
    args: {
      course_id: idArg(),
      organization_id: idArg(),
    },
    resolve: async (_, args, ctx) => {
      const { course_id, organization_id } = args
      const prisma: Prisma = ctx.prisma

      return prisma.courseOrganizations({
        where: {
          course: {
            id: course_id,
          },
          organization: {
            id: organization_id,
          },
        },
      })
    },
  })
}

const addCourseOrganizationQueries = (t: ObjectDefinitionBlock<"Query">) => {
  courseOrganizations(t)
}

export default addCourseOrganizationQueries
