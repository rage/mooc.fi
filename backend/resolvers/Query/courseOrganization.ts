import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg } from "nexus/dist"

const courseOrganizations = async (t: PrismaObjectDefinitionBlock<"Query">) => {
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

const addCourseOrganizationQueries = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  courseOrganizations(t)
}

export default addCourseOrganizationQueries
